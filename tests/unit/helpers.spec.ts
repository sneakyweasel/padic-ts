import { gcd, factors, modInverse } from '../../src/engine/helpers'
import Ratio from '../../src/engine/Ratio'

describe('Helpers', () => {
  it('Computes greatest common divisor.', () => {
    const gcd1 = gcd(15, 6)
    expect(gcd1).toEqual(3)
    const gcd2 = gcd(15156, 6564)
    expect(gcd2).toEqual(12)
  })

  it('Performs modular multiplicative inverse of a under mod m.', () => {
    expect(modInverse(3, 11)).toEqual(4)
  })

  it('Computes prime factors and their exponent in a dictionnary for a number.', () => {
    const facs1 = factors(60)
    expect(facs1).toEqual({ '2': 2, '3': 1, '5': 1 })
  })

  it('Computes the prime factors of a rational number in a dictionnary.', () => {
    const facs1 = factors(140)
    expect(facs1).toEqual({ '2': 2, '5': 1, '7': 1 })
    const facs2 = factors(297)
    expect(facs2).toEqual({ '11': 1, '3': 3 })
    const rat1 = new Ratio(140, 297).factors
    expect(rat1).toEqual({ '11': -1, '2': 2, '3': -3, '5': 1, '7': 1 })
  })

  it('Computes the prime factors of a rational number in a sorted array.', () => {
    const facs1 = factors(140)
    expect(facs1).toEqual({ '2': 2, '5': 1, '7': 1 })
    const facs2 = factors(297)
    expect(facs2).toEqual({ '11': 1, '3': 3 })
    const rat1 = new Ratio(140, 297).factorsArray()
    expect(rat1).toEqual([
      [2, 2],
      [3, -3],
      [5, 1],
      [7, 1],
      [11, -1],
    ])
  })

  it('Computes the ratio without the prime exponent.', () => {
    const facs1 = factors(162)
    expect(facs1).toEqual({ '2': 1, '3': 4 })
    const facs2 = factors(13)
    expect(facs2).toEqual({ '13': 1 })
    const rat1 = new Ratio(162, 13).reconstructWithoutPrime(3)
    expect(rat1.toString()).toEqual('2/13')
  })
})
