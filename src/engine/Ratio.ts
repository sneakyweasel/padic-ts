// Imports
import { modInv, factors, gcd } from './helpers'
import { MAX_EXP, MAX_ARG, MAX_PRIME } from './constants'
import Padic from './Padic'

/**
 * RATIO CLASS
 * Class describing a ratio and its operations.
 * n: numerator
 * d: denominator
 * sign: sign
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
   * @param sign - sign (+1 ou -1)
   * @returns Creates a ratio a/b
   */
  constructor(n: number, d = 1, sign = 1) {
    // Check for division by 0
    if (d === 0) {
      throw new Error("Can't divide by 0.")
    }
    // Process sign from numerator, denominator and sign by multiplicating
    if (n * d * sign >= 0) {
      n = Math.abs(n)
      d = Math.abs(d)
      sign = 1
    } else {
      n = Math.abs(n)
      d = Math.abs(d)
      sign = -1
    }

    this.n = n
    this.d = d
    this.sign = sign
  }

  //------------------
  // UNARY OPERATIONS
  //------------------

  /**
   * Negation
   * @returns -n/d ratio
   */
  neg(): Ratio {
    return new Ratio(this.n, this.d, -this.sign)
  }

  /**
   * Absolute value
   * @returns |n/d| ratio
   */
  abs(): Ratio {
    return new Ratio(this.n, this.d)
  }

  /**
   * Inverse
   * @returns d/n ratio
   */
  inverse(): Ratio {
    return new Ratio(this.sign * this.d, this.n)
  }

  /**
   * Reduce ratio using the GCD
   * @returns s2n/2d -> n/d
   */
  reduce(): Ratio {
    const common = gcd(this.n, this.d)
    return new Ratio(this.n / common, this.d / common, this.sign)
  }

  /**
   * Prime decompomposition of ratio
   * Returns a dict of primes and their exponents
   * @returns {"2": 1, "5": 2}
   */
  factors(): Record<string, number> {
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
   * @returns [[3, 2], [5, 1], [7, -1]]
   */
  factorsArray(): [number, number][] {
    const ratioFacs = this.factors()
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
   * Reconstruct rational part without prime exponent
   * @param prime
   * @returns ratio
   */
  absReconstruct(prime: number): Ratio {
    const ratioFacs = this.factorsArray()
    let num = 1
    let denum = 1
    ratioFacs.forEach((factor) => {
      if (factor[0] !== prime) {
        if (factor[1] > 0) {
          num *= factor[0] ** Math.abs(factor[1])
        } else {
          denum *= factor[0] ** Math.abs(factor[1])
        }
      }
    })
    return new Ratio(num, denum)
  }

  /**
   * Reconstruct prime part
   * @param prime
   * @returns ratio
   */
  primeReconstruct(prime: number): [number, number] {
    const ratioFacs = this.factors()
    if (prime in ratioFacs) {
      return [prime, ratioFacs[prime]]
    }
    return [prime, 0]
  }

  //-------------------
  // BINARY OPERATIONS
  //-------------------

  /**
   * Addition
   * @returns a+b ratio
   */
  add(b: Ratio): Ratio {
    const n = this.sign * this.n * b.d + b.sign * this.d * b.n
    const d = this.d * b.d
    return new Ratio(n, d)
  }

  /**
   * Substraction
   * @returns a-b ratio
   */
  sub(b: Ratio): Ratio {
    const n = this.sign * this.n * b.d - b.sign * this.d * b.n
    const d = this.d * b.d
    return new Ratio(n, d)
  }

  /**
   * Multiply
   * @returns a*b ratio
   */
  mul(b: Ratio): Ratio {
    const n = this.sign * b.sign * this.n * b.n
    const d = this.d * b.d
    return new Ratio(n, d)
  }

  /**
   * Divide
   * @returns a/b ratio
   */
  div(b: Ratio): Ratio {
    const n = this.sign * b.sign * this.n * b.d
    const d = this.d * b.n
    return new Ratio(n, d)
  }

  /**
   * Equality check
   * @param b other ratio
   * @returns boolean
   */
  equals(b: Ratio): boolean {
    return this.reduce().toString() === b.reduce().toString()
  }

  /**
   * Classical distance between ratios
   * @param b another ratio
   * @returns ratio
   */
  distance(b: Ratio): Ratio {
    return this.sub(b).reduce().abs()
  }

  //------------------
  // PADIC OPERATIONS
  //------------------

  /**
   * Padic valuation
   * @param p
   * @returns
   */
  padicValuation(p: number): number {
    const ratioFacs = this.factors()
    if (p in ratioFacs) {
      return ratioFacs[p]
    }
    return 0
  }

  /**
   * Padic absolute value
   * @returns padic absolute value
   */
  padicAbs(prime: number): Ratio {
    const pValuation = this.padicValuation(prime)
    const res = prime ** Math.abs(pValuation)
    if (this.n === 0) {
      return new Ratio(0, 1)
    } else if (pValuation > 0) {
      return new Ratio(1, res)
    } else {
      return new Ratio(res, 1)
    }
  }

  /**
   * Padic distance between ratios
   * @param b another ratio
   * @returns ratio
   */
  padicDistance(num: Ratio, p: number): Ratio {
    return this.distance(num).padicAbs(p)
  }

  /**
   * Convert ratio to p-adic number
   * @param prime
   * @param precision
   * @returns Padic
   */
  toPadic(prime: number, precision = 64): Padic {
    let a = this.n * this.sign
    let b = this.d

    // Sanity checks
    if (Math.abs(a) > MAX_ARG || b > MAX_ARG) {
      throw new Error("a and b shouldn't be > to MAX_ARG")
    }
    if (prime < 2 || precision < 1) {
      throw new Error('prime should be >= 2')
    }
    if (!Number.isInteger(prime)) {
      throw new Error('prime should be an integer.')
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

  //-------------
  // OUTPUT
  //-------------

  /**
   * Factors in katex string format
   * @returns katex string
   */
  factorsKatex(p: number, expNeg = false): string {
    const ratioFacs = this.factorsArray()
    let result = ''
    if (this.sign < 0) {
      result += '-'
    }
    if (this.n === 0) {
      return '0'
    }
    if (this.n === 1) {
      return '1'
    }
    const expMinus = expNeg ? '-' : ''
    ratioFacs.forEach((tuple) => {
      const prime = tuple[0]
      const exp = tuple[1]
      const repr_color = `\\textcolor{red}{${prime}}^{\\textcolor{red}{${expMinus}${exp}}}`
      const repr = `${prime}^{${expMinus}${exp}}`
      if (tuple[0] === p) {
        result += `${repr_color}\\:.\\:`
      } else {
        result += `${repr}\\:.\\:`
      }
    })
    result = result.substring(0, result.length - 3)
    return result
  }

  /**
   * Convert to a string
   * @returns ratio string
   */
  toKatex(): string {
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
      result += `\\frac{${this.n}}{${this.d}}`
    }
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
