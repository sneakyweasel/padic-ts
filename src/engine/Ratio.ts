// Imports
import { Step, modInverse, factors, gcd } from './helpers'
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
  factors: Record<string, number>

  /**
   * Ratio constructor and sign processing
   * @param n numerator
   * @param d denominator
   * @param sign sign (+1 ou -1)
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
    this.factors = this.generateFactors()
  }

  /**
   * Prime factorization of ratio
   * Returns a dict of primes and their exponents
   * @returns prime factors in dict format. Eg: {"2": 1, "5": 2}
   */
  generateFactors(): Record<string, number> {
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
   * Inverse numerator and denominator
   * @returns d/n ratio
   */
  inverse(): Ratio {
    return new Ratio(this.sign * this.d, this.n)
  }

  /**
   * Reduce ratio using the GCD
   * @returns simplified ratio
   */
  reduce(): Ratio {
    const common = gcd(this.n, this.d)
    return new Ratio(this.n / common, this.d / common, this.sign)
  }

  /**
   * Clone a ratio
   * @returns ratio deep copy
   */
  clone(): Ratio {
    return new Ratio(this.n, this.d, this.sign)
  }

  /**
   * Ratio factors in sorted array form
   * Useful for ordered output
   * @returns [prime, exponent] array. Eg: [[3, 2], [5, 1], [7, -1]]
   */
  factorsArray(): [number, number][] {
    const factors = this.factors
    const result: [number, number][] = []
    Object.keys(factors)
      .map((key) => {
        return parseInt(key)
      })
      .map(function (key) {
        result.push([key, factors[key.toString()]])
        return result
      })
    return result
  }

  /**
   * Reconstruct ratio without prime exponent
   * @param prime
   * @returns ratio without p-adic prime
   */
  reconstructWithoutPrime(prime: number): Ratio {
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
   * Check if prime is a factor of ratio
   * @param prime
   * @returns boolean
   */
  isFactor(prime: number): boolean {
    return prime in this.factors
  }

  /**
   * Reconstruct prime part
   * @param prime
   * @returns ratio
   */
  factor(prime: number): [number, number] {
    if (this.isFactor(prime)) {
      return [prime, this.factors[prime]]
    }
    return [prime, 0]
  }

  //-------------------
  // BINARY OPERATIONS
  //-------------------

  /**
   * Addition
   * @returns a + b ratio
   */
  add(b: Ratio): Ratio {
    const n = this.sign * this.n * b.d + b.sign * this.d * b.n
    const d = this.d * b.d
    return new Ratio(n, d)
  }

  /**
   * Substraction
   * @returns a - b ratio
   */
  sub(b: Ratio): Ratio {
    const n = this.sign * this.n * b.d - b.sign * this.d * b.n
    const d = this.d * b.d
    return new Ratio(n, d)
  }

  /**
   * Multiply
   * @returns a * b ratio
   */
  mul(b: Ratio): Ratio {
    const n = this.sign * b.sign * this.n * b.n
    const d = this.d * b.d
    return new Ratio(n, d)
  }

  /**
   * Divide
   * @returns a / b ratio
   */
  div(b: Ratio): Ratio {
    const n = this.sign * b.sign * this.n * b.d
    const d = this.d * b.n
    return new Ratio(n, d)
  }

  /**
   * Classical distance between ratios
   * @param b another ratio
   * @returns ratio
   */
  distance(b: Ratio): Ratio {
    return this.sub(b).reduce().abs()
  }

  /**
   * Equality check
   * @param b other ratio
   * @returns boolean
   */
  equals(b: Ratio): boolean {
    return this.reduce().toString() === b.reduce().toString()
  }

  //------------------
  // PADIC OPERATIONS
  //------------------

  /**
   * Padic valuation
   * @param prime
   * @returns padic valuation
   */
  padicValuation(prime: number): number {
    return this.factor(prime)[1]
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
   * Returns next padic digit
   * TODO: Tests not passing
   * @param prime
   * @returns integer < prime
   */
  nextPadicRatio(prime: number): Step {
    const pRatio = new Ratio(prime)
    for (let i = 0; i < prime; i++) {
      const digit = new Ratio(i)
      for (let n = 0; n <= this.d; n++) {
        const newRatio = new Ratio(n, this.d, -1)
        if (digit.add(pRatio.mul(newRatio)).equals(this)) {
          return { digit: digit.n, next: newRatio, orig: this }
        }
      }
    }
    throw new Error(`Can't compute next digit: ${pRatio}`)
  }

  /**
   * ToPadicExpansion
   * Alternate generating fonction for padic expansion
   * TODO: Tests not passing
   * Exemple:
   * 3-adic expansion of 2/5 = 1,1,2,1,0,1
   *  2/5 = 1 - 3 * 1/5
   * -1/5 = 1 - 3 * 2/5
   * -2/5 = 2 - 3 * 4/5
   * -4/5 = 1 - 3 * 3/5
   * -3/5 = 0 - 3 * 1/5
   * -1/5 = 0 - 3 * 2/5
   * @param prime
   * @param precision
   * @returns padic expansion
   */
  toPadicExpansion(prime: number, precision = 32): Step[] {
    const result: { digit: number; next: Ratio; orig: Ratio }[] = []
    let ratio = this.clone()
    for (let i = 0; i < precision; i++) {
      const nextDigit = ratio.nextPadicRatio(prime)
      result.push(nextDigit)
      ratio = nextDigit.next
    }
    return result
  }

  /**
   * Convert ratio to p-adic number
   * @param prime
   * @param precision
   * @returns Padic
   */
  toPadic(prime: number, precision = 64): Padic {
    const ratio = this.reduce()
    let a = ratio.n * ratio.sign
    let b = ratio.d

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
    const b1 = modInverse(r, prime)

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
   * Reconstruct padic computation steps from p-adic digits
   * @param prime
   * @returns p-adic steps
   */
  toPadicSteps(prime: number, precision: number): Step[] {
    const steps: Step[] = []
    const digits = this.toPadic(prime).toArray()
    let orig = this.clone()
    for (const digit of digits) {
      const next = orig.sub(new Ratio(digit)).div(new Ratio(prime)).reduce()
      steps.push({ digit, orig, next })
      orig = next
    }
    return steps.slice(0, precision)
  }

  //-------------
  // OUTPUT
  //-------------

  /**
   * Factors in katex string format
   * @returns katex string
   */
  factorsKatex(p: number, expNeg = false): string {
    let result = ''
    if (this.n === 0) {
      return '0'
    }
    if (this.sign < 0) {
      result += '-'
    }
    const expMinus = expNeg ? '-' : ''
    this.factorsArray().forEach((tuple) => {
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

  /**
   * To fixed
   */
  toFixed(dec = 2): string {
    return ((this.sign * this.n) / this.d).toFixed(dec)
  }
}
