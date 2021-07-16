// Imports
import { min, abs, negExp, modInv } from './helpers'

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
    // Sanity check
    if (b === 0) {
      throw new Error("Can't divide by 0.")
    }
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
  convertToPadic(p = 7, k = 11): number {
    let a = this.a
    let b = this.b

    // Sanity checks
    if (abs(a) > MAX_ARG || b > MAX_ARG) {
      throw new Error('a and b should be > to MAX_ARG')
    }
    if (p < 2 || k < 1) {
      throw new Error('p should be >= 2')
    }
    if (k < 1) {
      throw new Error('k should be > 1')
    }
    if (!Number.isInteger(p)) {
      throw new Error('p should be an integer.')
    }
    if (!Number.isInteger(k)) {
      throw new Error('k should be an integer.')
    }

    // Clip values if they exceed maximum values
    p = min(p, MAX_P) // maximum short prime
    k = min(k, MAX_EXP - 1) // maximum array length
    console.log(`${a}/${b} + 0(${p}^${k})\n`) // numerator, denominator, prime, precision

    // find -exponent of p in b
    b = negExp(b, p)

    // modular inverse for small p
    const r = b % p
    const b1 = modInv(r, p)

    // Initialize padic variables
    let pav = MAX_EXP
    const pad = new Array<number>(2 * MAX_EXP).fill(0)

    pav = MAX_EXP
    for (;;) {
      // find exponent of P in a
      let i = 0
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
    console.log('PADIC EXPANSION: ' + pad.toString())
    return 0
  }
}

/**
 * Padic class
 */
export class Padic {
  r: Ratio
  p: number
  k: number
  v = 0
  d: number[] = []

  constructor(r: Ratio, p: number, k: number) {
    this.r = r
    this.p = p
    this.k = k
  }
}
