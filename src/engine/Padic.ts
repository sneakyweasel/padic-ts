// Imports
import { MAX_EXP, MAX_APPROX } from './constants'
import Ratio from './Ratio'

/**
 * Padic class
 */
export default class Padic {
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
   * Reconstruct Padic from string of numbers
   * Convert to numbers and extract valuation point if any
   * @param str Number string separated by spaces
   */
  static fromString(str: string, prime: number, precision: number): Padic {
    let valuation = 0
    // Convert to numbers and retrieve valuation
    const arr: number[] = []
    str
      .split(' ')
      .reverse()
      .flatMap((chunk, i) => {
        if (chunk.includes('.')) {
          valuation = i
        }
        arr.push(parseInt(chunk))
      })
    // Copy into zero filled array
    const expansion = new Array<number>(2 * MAX_EXP).fill(0)
    arr.forEach((num, i) => {
      expansion[i + MAX_EXP] = num
    })
    return new Padic(prime, precision, valuation, expansion)
  }

  /**
   * Padic expansion sum
   * Horner's rule
   * @returns sum
   */
  dsum(): number {
    const t = Math.min(this.valuation, 0)
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
    result.valuation = Math.min(this.valuation, b.valuation)
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
   * Returns precision sliced array
   * @returns expansion number array
   */
  toArray(): number[] {
    const start = Math.min(this.valuation, 0) + MAX_EXP
    const end = this.precision + start
    return this.expansion.slice(start, end)
  }

  /**
   * Generate expansion string
   * @returns expansion string
   */
  toString(): string {
    let str = ''
    const t = Math.min(this.valuation, 0)
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
