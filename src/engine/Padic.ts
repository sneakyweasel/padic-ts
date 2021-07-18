// Imports
import { min, abs, modInv } from './helpers'

// Constants
const MAX_EXP = 64 // maximum exponent (if indexing starts at -EMX)
const MAX_ARG = 1048576 // maximum argument
const MAX_PRIME = 32749 // maximum prime
const MAX_APPROX = 100000 // maximum approximation loop

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
    prime = min(prime, MAX_PRIME) // maximum short prime
    precision = min(precision, MAX_EXP - 1) // maximum array length
    // console.log(`${a}/${b} + 0(${prime}^${precision})\n`)

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

  toString(): string {
    return `${this.a}/${this.b}`
  }
}

/**
 * Padic class
 */
export class Padic {
  prime: number
  precision: number
  valuation: number
  expansion: number[]

  constructor(
    prime: number,
    precision: number,
    valuation = 0,
    expansion: number[] = new Array<number>(2 * MAX_EXP).fill(0),
  ) {
    this.prime = prime
    this.precision = precision
    this.valuation = valuation
    this.expansion = expansion
  }

  /**
   * Reconstruct Padic from string
   * @param str Number string separated by spaces
   */
  // fromString(str: string): any {
  //   const arr = str.split(' ')
  //   const prime = parseInt(str[-1])
  //   const precision = arr.length()
  // }

  /**
   * Padic expansion sum
   * Horner's rule
   * @returns sum
   */
  dsum(): number {
    const t = min(this.valuation, 0)
    let sum = 0
    for (let i = this.precision - 1 + t; i >= t; i--) {
      const r = sum
      sum *= this.prime
      if (r != 0 && sum / r - this.prime != 0) {
        // overflow
        sum = -1
        break
      }
      sum += this.expansion[i + MAX_EXP]
    }
    return sum
  }

  /**
   * Add two padic numbers
   * @returns Padic
   */
  add(b: Padic): Padic {
    let c = 0
    const result = new Padic(this.prime, this.precision)
    result.valuation = min(this.valuation, b.valuation)
    for (let i = result.valuation; i <= this.precision + result.valuation; i++) {
      c += this.expansion[i + MAX_EXP] + b.expansion[i + MAX_EXP]
      if (c > this.prime - 1) {
        result.expansion[i + MAX_EXP] = c - this.prime
        c = 1
      } else {
        result.expansion[i + MAX_EXP] = c
        c = 0
      }
    }
    return result
  }

  /**
   * complement of receiver
   * @returns Padic numbe
   */
  cmpt(): Padic {
    let c = 1
    const p1 = this.prime - 1
    const pa = new Padic(this.prime, this.precision, this.valuation, this.expansion)
    pa.valuation = this.valuation
    for (let i = this.valuation; i <= this.precision + this.valuation; i++) {
      c += p1 - pa.expansion[i + MAX_EXP]
      if (c > p1) {
        pa.expansion[i + MAX_EXP] = c - this.prime
        c = 1
      } else {
        pa.expansion[i + MAX_EXP] = c
        c = 0
      }
    }
    return pa
  }

  /**
   * Rational reconstruction of p-adic number
   * @returns rational
   */
  convertToRatio(): Ratio {
    let fl = false
    let padic = new Padic(this.prime, this.precision, this.valuation, this.expansion)
    let j = 0
    const p1 = this.prime - 1

    // denominator count
    let i = 1
    for (; i <= MAX_APPROX; ) {
      // check for integer
      j = this.precision - 1 + this.valuation
      for (; j >= this.valuation; j--) {
        if (this.expansion[j + MAX_EXP] !== 0) {
          break
        }
      }
      fl = (j - this.valuation) * 2 < this.precision
      if (fl) {
        fl = false
        break
      }

      // check negative integer
      j = this.precision - 1 + this.valuation
      for (; j >= this.valuation; j--) {
        if (p1 - padic.expansion[j + MAX_EXP] !== 0) {
          break
        }
      }
      fl = (j - this.valuation) * 2 < this.precision
      if (fl) {
        break
      }

      // repeatedly add self to s
      padic = padic.add(this)
      i++
    }
    if (fl) {
      padic = padic.cmpt()
    }

    // numerator: weighted digit sum
    let x = padic.dsum()
    let y = i
    if (x < 0 || y > MAX_APPROX) {
      // console.log(x, y)
      throw new Error('Rational reconstruction failed')
    } else {
      // negative powers
      for (let i = this.valuation; i <= -1; i++) {
        y *= this.prime
      }

      // negative rational
      if (fl) {
        x = -x
      }
      return new Ratio(x, y)
    }
  }

  /**
   * Print expansion
   * @returns expansion string
   */
  toString(): string {
    let str = ''
    const t = min(this.valuation, 0)
    for (let i = this.precision - 1 + t; i >= t; i--) {
      str += this.expansion[i + MAX_EXP]
      if (i == 0 && this.valuation < 0) {
        str += '.'
      }
      str += ' '
    }
    return str.trim()
  }
}
