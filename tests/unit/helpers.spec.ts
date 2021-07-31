import {
  gcdExtended,
  factors,
  invertFactors,
  ratioFactors,
  ratioFactorsArray,
  ratioFactorsKatex,
} from '../../src/engine/helpers'

describe('Helpers', () => {
  it('Computes greatest common divisor.', () => {
    const gcd1 = gcdExtended(15, 6)
    expect(gcd1).toEqual(3)
    const gcd2 = gcdExtended(15156, 6564)
    expect(gcd2).toEqual(12)
  })

  it('Computes prime factors and their exponent in a dictionnary for a number.', () => {
    const facs1 = factors(60)
    expect(facs1).toEqual({ '2': 2, '3': 1, '5': 1 })
  })

  it('Inverts exponents fpr prime factorization of a number.', () => {
    const facs1 = invertFactors(60)
    expect(facs1).toEqual({ '2': -2, '3': -1, '5': -1 })
  })

  it('Computes the prime factors of a rational number in a dictionnary.', () => {
    const facs1 = factors(140)
    expect(facs1).toEqual({ '2': 2, '5': 1, '7': 1 })
    const facs2 = factors(297)
    expect(facs2).toEqual({ '11': 1, '3': 3 })
    const rat1 = ratioFactors(140, 297)
    expect(rat1).toEqual({ '11': -1, '2': 2, '3': -3, '5': 1, '7': 1 })
  })

  it('Computes the prime factors of a rational number in a sorted array.', () => {
    const facs1 = factors(140)
    expect(facs1).toEqual({ '2': 2, '5': 1, '7': 1 })
    const facs2 = factors(297)
    expect(facs2).toEqual({ '11': 1, '3': 3 })
    const rat1 = ratioFactorsArray(140, 297)
    expect(rat1).toEqual([
      [2, 2],
      [3, -3],
      [5, 1],
      [7, 1],
      [11, -1],
    ])
  })

  it('Computes the prime factors of a rational number in katex format.', () => {
    const facs1 = factors(140)
    expect(facs1).toEqual({ '2': 2, '5': 1, '7': 1 })
    const facs2 = factors(297)
    expect(facs2).toEqual({ '11': 1, '3': 3 })
    const rat1 = ratioFactorsKatex(140, 297)
    expect(rat1).toEqual('2^{2} + 3^{-3} + 5^{1} + 7^{1} + 11^{-1}')
  })
})
