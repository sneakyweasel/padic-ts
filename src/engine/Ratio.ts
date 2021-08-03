// Imports
import { modInv, factors, gcd } from './helpers'
import { MAX_EXP, MAX_ARG, MAX_PRIME } from './constants'
import Padic from './Padic'

/**
 * Ratio class
 */
export default class Ratio {
  n: number
  d: number
  sign: number

  /**
   * Creates a rational number
   *
   * @param n - numerator
   * @param d - denominator
   * @param sign - sign
   * @returns Creates a ratio a/b
   */
  constructor(n: number, d = 1, sign = 1) {
    // Check for division by 0
    if (d === 0) {
      throw new Error("Can't divide by 0.")
    }
    // Process sign from numerator, denominator and sign
    if (Math.sign(n) < 0 && Math.sign(d) < 0) {
      n = Math.abs(n)
      d = Math.abs(d)
    }
    if (
      (Math.sign(n) < 0 && Math.sign(d) > 0 && sign < 0) ||
      (Math.sign(n) > 0 && Math.sign(d) < 0 && sign < 0)
    ) {
      n = Math.abs(n)
      d = Math.abs(d)
      sign = 1
    }
    this.n = n
    this.d = d
    this.sign = sign
  }

  //-------------------
  // UNARY OPERATIONS
  //-------------------

  /**
   * Negation
   */
  neg(): Ratio {
    return new Ratio(this.n, this.d, -this.sign)
  }

  /**
   * Absolute value
   */
  abs(): Ratio {
    return new Ratio(this.n, this.d)
  }

  /**
   * Inverse
   */
  inverse(): Ratio {
    return new Ratio(this.sign * this.d, this.n)
  }

  //-------------------
  // BINARY OPERATIONS
  //-------------------

  /**
   * Addition
   */
  add(b: Ratio): Ratio {
    const n = this.sign * this.n * b.d + b.sign * this.d * b.n
    const d = this.d * b.d
    return new Ratio(n, d)
  }

  /**
   * Substraction
   */
  sub(b: Ratio): Ratio {
    const n = this.sign * this.n - b.d + b.sign * this.d * b.n
    const d = this.d * b.d
    return new Ratio(n, d)
  }

  /**
   * Multiply
   */
  mul(b: Ratio): Ratio {
    const n = this.sign * b.sign * this.n * b.n
    const d = this.d * b.d
    return new Ratio(n, d)
  }

  /**
   * Divide
   */
  div(b: Ratio): Ratio {
    const n = this.sign * b.sign * this.n * b.d
    const d = this.d * b.n
    return new Ratio(n, d)
  }

  /**
   * Reduce ratio using GCD
   * @param numerator
   * @param denominator
   * @returns
   */
  reduce(): Ratio {
    const res = gcd(this.n, this.d)
    return new Ratio(this.n / res, this.d / res)
  }

  /**
   * Convert ratio to p-adic number
   * @param prime
   * @param precision
   */
  convertToPadic(prime = 7, precision = 11): Padic {
    let a = this.n
    let b = this.d

    // Sanity checks
    if (Math.abs(a) > MAX_ARG || b > MAX_ARG) {
      throw new Error('a and b should be > to MAX_ARG')
    }
    if (prime < 2 || precision < 1) {
      throw new Error('p should be >= 2')
    }
    if (!Number.isInteger(prime)) {
      throw new Error('p should be an integer.')
    }
    if (!Number.isInteger(precision)) {
      throw new Error('k should be an integer.')
    }
    if (a === 0) {
      throw new Error("a shouldn't be zero.")
    }
    if (b === 0) {
      throw new Error("b shouldn't be zero, can't divide by zero.")
    }

    // Clip values if they exceed maximum values
    prime = Math.min(prime, MAX_PRIME) // maximum short prime
    precision = Math.min(precision, MAX_EXP - 1) // maximum array length

    // find -exponent of p in b
    let i = 0
    for (; b % prime == 0; i--) {
      b = b / prime
    }

    // modular inverse for small p
    const r = b % prime
    const b1 = modInv(r, prime)

    // Initialize padic variables
    let valuation = MAX_EXP
    const expansion = new Array<number>(2 * MAX_EXP).fill(0)

    for (;;) {
      // find exponent of P in a
      for (; a % prime === 0; i++) {
        a = a / prime
      }

      // valuation
      if (valuation === MAX_EXP) {
        valuation = i
      }

      // upper bound
      if (i >= MAX_EXP) {
        break
      }

      // check precision
      if (i - valuation > precision) {
        break
      }

      // next digit
      expansion[i + MAX_EXP] = (a * b1) % prime
      if (expansion[i + MAX_EXP] < 0) {
        expansion[i + MAX_EXP] += prime
      }

      // remainder - digit * divisor
      a -= expansion[i + MAX_EXP] * b
      if (a === 0) {
        break
      }
    }
    return new Padic(prime, precision, valuation, expansion)
  }

  /**
   * Classical distance between ratios
   * @param b another ratio
   * @returns ratio
   */
  euclideanDistance(num: Ratio): Ratio {
    const resa = Math.abs(this.n * num.d - num.n * this.d)
    const resb = Math.abs(this.d * num.d)
    return new Ratio(resa, resb).reduce()
  }

  /**
   * Padic distance between ratios
   * @param b another ratio
   * @returns ratio
   */
  padicDistance(num: Ratio, p: number): Ratio {
    return this.euclideanDistance(num).padicNorm(p)
  }

  /**
   * Padic Norm
   * https://codegolf.stackexchange.com/questions/63629/calculate-the-p-adic-norm-of-a-rational-number
   * @param a
   * @param b
   * @returns padic distance
   */
  padicNorm(p: number): Ratio {
    if (this.n === 0) {
      return new Ratio(0, 1)
    }
    const factors = this.factorsDict()
    // check if prime is included in prime factorization
    const keys = [...Object.keys(factors)]
    const uniq = [...new Set(keys)]
    if (!uniq.includes(p.toString())) {
      return new Ratio(1, 1)
    }
    // in factors
    const factor = factors[p.toString()]
    const res = p ** Math.abs(factors[p.toString()])
    if (factor > 0) {
      return new Ratio(1, res)
    } else {
      return new Ratio(res, 1)
    }
  }

  /**
   * Prime decompomposition of ratio
   * @returns dict of primes and their exponents
   */
  factorsDict(): Record<string, number> {
    const factorsA: Record<string, number> = factors(Math.abs(this.n))
    const factorsB: Record<string, number> = factors(Math.abs(this.d))
    // get unique keys
    const keys = [...Object.keys(factorsA), ...Object.keys(factorsB)]
    const uniq = [...new Set(keys)]
    // perform addition
    const result: Record<string, number> = {}
    uniq.forEach((key: string) => {
      let counter = 0
      if (key in factorsA) {
        counter += factorsA[key]
      }
      if (key in factorsB) {
        counter -= factorsB[key]
      }
      if (counter !== 0) {
        result[key] = counter
      }
    })
    return result
  }

  /**
   * Ratio factors in sorted array form
   * @returns factors array
   */
  factorsArray(): [number, number][] {
    const ratioFacs = this.factorsDict()
    const result: [number, number][] = []
    Object.keys(ratioFacs)
      .map((key) => {
        return parseInt(key)
      })
      .map(function (key) {
        result.push([key, ratioFacs[key.toString()]])
        return result
      })
    return result
  }

  /**
   * Reconstruct rational part without prime used for padic norm
   * @param p
   * @returns ratio
   */
  absReconstruct(p: number): [number, number] {
    const ratioFacs = this.factorsArray()
    let num = 1
    let denum = 1
    ratioFacs.forEach((factor) => {
      if (factor[0] !== p) {
        if (factor[1] > 0) {
          num *= factor[0] ** Math.abs(factor[1])
        } else {
          denum *= factor[0] ** Math.abs(factor[1])
        }
      }
    })
    return [num, denum]
  }

  /**
   * Reconstruct prime part used for padic norm
   * @param a
   * @param b
   * @param p
   * @returns ratio
   */
  primeReconstruct(p: number): [number, number] {
    const ratioFacs = this.factorsDict()
    if (p in ratioFacs) {
      return [p, ratioFacs[p]]
    }
    return [p, 0]
  }

  /**
   * Factors in katex string format
   * @returns katex string
   */
  factorsKatex(p: number): string {
    const ratioFacs = this.factorsArray()
    let result = ' = '
    ratioFacs.forEach((tuple) => {
      if (tuple[0] === p) {
        result += `\\textcolor{red}{${tuple[0]}^{${tuple[1] !== 1 ? tuple[1] : ''}}}\\:.\\:`
      } else {
        result += `${tuple[0]}^{${tuple[1] !== 1 ? tuple[1] : ''}}\\:.\\:`
      }
    })
    result = result.substring(0, result.length - 3)
    return result
  }

  //-------------
  // OUTPUT
  //-------------

  /**
   * Convert to a string
   * @returns ratio string
   */
  toKatex(): string {
    let result = ''
    if (this.sign === -1) {
      result += '-'
    }
    if (this.d === 1) {
      result += `${this.sign}${this.n}`
    }
    result += `${this.sign}\\frac{${this.n}}{${this.d}}`
    return result
  }

  /**
   * Convert to a string
   * @returns ratio string
   */
  toString(): string {
    let result = ''
    if (this.n === 0) {
      return '0'
    }
    if (this.sign < 0) {
      result += '-'
    }
    if (this.d === 1) {
      result += `${this.n}`
    } else {
      result += `${this.n}/${this.d}`
    }
    return result
  }
}
