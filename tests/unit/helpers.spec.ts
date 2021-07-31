import { gcdExtended, factors } from '../../src/engine/helpers'

describe('Helpers', () => {
  it('Computes greatest common divisor.', () => {
    const gcd1 = gcdExtended(15, 6)
    expect(gcd1).toEqual(3)
    const gcd2 = gcdExtended(15156, 6564)
    expect(gcd2).toEqual(12)
  })

  it('Computes prime factors of a number.', () => {
    const facs1 = factors(60)
    expect(facs1).toEqual({ '2': 2, '3': 1, '5': 1 })
  })
})
