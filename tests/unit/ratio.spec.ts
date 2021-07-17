import { gcdExtended, modInv, negExp } from '../../src/engine/helpers'
import { Ratio } from '../../src/engine/Padic'

describe('Ratio', () => {
  it('Errors when denominator is zéro.', () => {
    const t = () => {
      new Ratio(1, 0)
    }
    expect(t).toThrow("Can't divide by 0.")
  })

  it('Computes greatest common divisor.', () => {
    const gcd1 = gcdExtended(15, 6)
    expect(gcd1).toEqual(3)
    const gcd2 = gcdExtended(15156, 6564)
    expect(gcd2).toEqual(12)
  })

  it('Computes negative exponent.', () => {
    const negExp1 = negExp(8, 7)
    expect(negExp1).toEqual(8)
    const negExp2 = negExp(30809, 7)
    expect(negExp2).toEqual(30809)
    const negExp3 = negExp(6649, 61)
    expect(negExp3).toEqual(109)
  })

  it('Computes modular inverse.', () => {
    const modinv1 = modInv(42, 2017)
    expect(modinv1).toEqual(1969)
    const modinv2 = modInv(5, 7)
    expect(modinv2).toEqual(3)
    const modinv3 = modInv(7, 32749)
    expect(modinv3).toEqual(9357)
    const modinv4 = modInv(379, 32749)
    expect(modinv4).toEqual(1901)
  })

  it('Performs correct padic evalution', () => {
    const test = [
      // Classic
      { a: 2, b: 1, p: 2, k: 4, pav: '', pad: '0 0 1 0' },
      { a: 1, b: 1, p: 2, k: 4, pav: '', pad: '0 0 1 1' },
      { a: 4, b: 1, p: 2, k: 4, pav: '', pad: '0 1 0 0' },
      { a: 3, b: 1, p: 2, k: 4, pav: '', pad: '0 0 1 1' },
      { a: 4, b: 1, p: 2, k: 5, pav: '', pad: '0 0 1 0 0' },
      { a: 3, b: 1, p: 2, k: 5, pav: '', pad: '0 0 0 1 1' },
      { a: 4, b: 9, p: 5, k: 4, pav: '', pad: '4 2 1 1' },
      { a: 8, b: 9, p: 5, k: 4, pav: '', pad: '3 4 2 2' },
      { a: 26, b: 25, p: 5, k: 4, pav: '', pad: '0 1. 0 1' },
      { a: -109, b: 125, p: 5, k: 4, pav: '', pad: '4. 0 3 1' },
      { a: 49, b: 2, p: 7, k: 6, pav: '', pad: '3 3 3 4 0 0' },
      { a: -4851, b: 2, p: 7, k: 6, pav: '', pad: '3 2 3 3 0 0' },
      { a: -9, b: 5, p: 3, k: 8, pav: '', pad: '2 1 0 1 2 1 0 0' },
      { a: 27, b: 7, p: 3, k: 8, pav: '', pad: '1 2 0 1 1 0 0 0' },
      { a: 5, b: 19, p: 2, k: 12, pav: '', pad: '0 0 1 0 1 0 0 0 0 1 1 1' },
      { a: -101, b: 384, p: 2, k: 12, pav: '', pad: '1 0 1 0 1. 0 0 0 1 0 0 1' },
      // Two decadic pairs
      { a: 2, b: 7, p: 10, k: 7, pav: '', pad: '5 7 1 4 2 8 6' },
      { a: -1, b: 7, p: 10, k: 7, pav: '', pad: '7 1 4 2 8 5 7' },
      { a: 34, b: 21, p: 10, k: 9, pav: '', pad: '9 5 2 3 8 0 9 5 4' },
      { a: -39034, b: 791, p: 10, k: 9, pav: '', pad: '1 3 9 0 6 4 4 2 6' },
    ]
    const i = 0
    const a = test[i]['a']
    const b = test[i]['b']
    const p = test[i]['p']
    const k = test[i]['k']
    const ratio1 = new Ratio(a, b)
    const padic1 = ratio1.convertToPadic(p, k)
    padic1.toString()
  })

  xit('Perfoms correct padic conversion', () => {
    // Classic
    const test = [
      [2, 1, 2, 4, 1, 1],
      [4, 1, 2, 4, 3, 1],
      [4, 1, 2, 5, 3, 1],
      [4, 9, 5, 4, 8, 9],
      [26, 25, 5, 4, -109, 125],
      [49, 2, 7, 6, -4851, 2],
      [-9, 5, 3, 8, 27, 7],
      [5, 19, 2, 12, -101, 384],
      // Two decadic pairs
      [2, 7, 10, 7, -1, 7],
      [34, 21, 10, 9, -39034, 791],
      // Familiar digits
      [11, 4, 2, 43, 679001, 207],
      [-8, 9, 23, 9, 302113, 92],
      [-22, 7, 3, 23, 46071, 379],
      [-22, 7, 32749, 3, 46071, 379],
      [35, 61, 5, 20, 9400, 109],
      [-101, 109, 61, 7, 583376, 6649],
      [-25, 26, 7, 13, 5571, 137],
      [1, 4, 7, 11, 9263, 2837],
      [122, 407, 7, 11, -517, 1477],
      // More subtle digits
      [5, 8, 7, 11, 353, 30809],
    ]
    const i = 1
    const p = test[i][2]
    const k = test[i][3]
    const ratio1 = new Ratio(test[i][0], test[i][1])
    ratio1.convertToPadic(p, k)
    const ratio2 = new Ratio(test[i][4], test[i][5])
    ratio2.convertToPadic(p, k)
  })
})
