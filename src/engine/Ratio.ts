// Imports
import { abs, modInv } from './helpers'
import { MAX_EXP, MAX_ARG, MAX_PRIME } from './constants'
import Padic from './Padic'

/**
 * Ratio class
 */
export default class Ratio {
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
    // Check for division by 0
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
   * @param prime
   * @param precision
   */
  convertToPadic(prime = 7, precision = 11): Padic {
    let a = this.a
    let b = this.b

    // Sanity checks
    if (abs(a) > MAX_ARG || b > MAX_ARG) {
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
   * Classical distance between integers
   * @param b another ratio
   */
  euclideanDistance(num: Ratio): number {
    return this.a / this.b - num.a / num.b
  }

  /**
   * Classical distance between integers
   * @param b another ratio
   */
  padicDistance(num: Ratio): number {
    return this.a / this.b - num.a / num.b
  }

  toString(): string {
    return `${this.a}/${this.b}`
  }
}
