// Imports
import { min, abs, modInv } from './helpers'

// Constants
const MAX_EXP = 64 // maximum exponent (if indexing starts at -EMX)
const DMX = 100000 // maximum approximation loop
const MAX_ARG = 1048576 // maximum argument
const MAX_P = 32749 // maximum prime

/**
 * Ratio class
 */
export class Ratio {
  a: number
  b: number

  /**
   * Creates a rational number
   *
   * @param a - numerator
   * @param b - denominator
   * @returns Creates a ratio a/b
   */
  constructor(a: number, b = 1) {
    // Flip sign if denominator is negative
    if (b < 0) {
      a = -a
      b = -b
    }
    this.a = a
    this.b = b
  }

  /**
   * Convert ratio to p-adic number
   * @param p - prime
   * @param k - precision
   */
  convertToPadic(p = 7, k = 11): Padic {
    let a = this.a
    let b = this.b

    // Sanity checks
    if (abs(a) > MAX_ARG || b > MAX_ARG) {
      throw new Error('a and b should be > to MAX_ARG')
    }
    if (p < 2 || k < 1) {
      throw new Error('p should be >= 2')
    }
    if (!Number.isInteger(p)) {
      throw new Error('p should be an integer.')
    }
    if (!Number.isInteger(k)) {
      throw new Error('k should be an integer.')
    }
    if (a === 0) {
      throw new Error("a shouldn't be zero.")
    }
    if (b === 0) {
      throw new Error("b shouldn't be zero, can't divide by zero.")
    }

    // Clip values if they exceed maximum values
    p = min(p, MAX_P) // maximum short prime
    k = min(k, MAX_EXP - 1) // maximum array length
    console.log(`${a}/${b} + 0(${p}^${k})\n`) // numerator, denominator, prime, precision

    // find -exponent of p in b
    let i = 0
    for (; b % p == 0; i--) {
      b = b / p
    }

    // modular inverse for small p
    const r = b % p
    const b1 = modInv(r, p)

    // Initialize padic variables
    let pav = MAX_EXP
    const pad = new Array<number>(2 * MAX_EXP).fill(0)

    for (;;) {
      // find exponent of P in a
      for (; a % p === 0; i++) {
        a = a / p
      }

      // valuation
      if (pav === MAX_EXP) {
        pav = i
      }

      // upper bound
      if (i >= MAX_EXP) {
        break
      }

      // check precision
      if (i - pav > k) {
        break
      }

      // next digit
      pad[i + MAX_EXP] = (a * b1) % p
      if (pad[i + MAX_EXP] < 0) {
        pad[i + MAX_EXP] += p
      }

      // remainder - digit * divisor
      a -= pad[i + MAX_EXP] * b
      if (a === 0) {
        break
      }
    }
    console.log('PAV: ' + pav)
    return new Padic(this, p, k, pav, pad)
  }
}

/**
 * Padic class
 */
export class Padic {
  r: Ratio
  p: number
  k: number
  valuation = 0
  d: number[] = []

  constructor(r: Ratio, p: number, k: number, v: number, d: number[]) {
    this.r = r
    this.p = p
    this.k = k
    this.valuation = v
    this.d = d
  }

  /**
   * Horner's rule
   * @returns sum
   */
  dsum(): number {
    const t = min(this.valuation, 0)
    let sum = 0
    for (let i = this.k - 1 + t; i >= t; i--) {
      const r = sum
      sum *= this.p
      if (r != 0 && sum / r - this.p != 0) {
        // overflow
        sum = -1
        break
      }
      sum += this.d[i + MAX_EXP]
    }
    return sum
  }

  /**
   * complement of receiver
   * @returns Padic numbe
   */
  cmpt(): Padic {
    let c = 1
    const p1 = this.p - 1
    const pa = new Padic(this.r, this.p, this.k, this.valuation, this.d)
    pa.valuation = this.valuation
    for (let i = this.valuation; i <= this.k + this.valuation; i++) {
      c += p1 - pa.d[i + MAX_EXP]
      if (c > p1) {
        pa.d[i + MAX_EXP] = c - this.p
        c = 1
      } else {
        pa.d[i + MAX_EXP] = c
        c = 0
      }
    }
    return pa
  }

  /**
   * Print expansion
   * @returns expansion string
   */
  toString(): string {
    let str = ''
    const t = min(this.valuation, 0)
    for (let i = this.k - 1 + t; i >= t; i--) {
      str += this.d[i + MAX_EXP]
      if (i == 0 && this.valuation < 0) {
        str += '.'
      }
      str += ' '
    }
    console.log(str)
    return str
  }
}
