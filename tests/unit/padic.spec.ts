import { Ratio, Padic } from '../../src/engine/Padic'

describe('Padic', () => {
  it('Computes padic expansion.', () => {
    const ratio = new Ratio(1, 3)
    const padic = ratio.convertToPadic(5, 10)
    const padic_str = padic.toString()
    expect(padic.valuation).toEqual(0)
    expect(padic_str).toEqual('3 1 3 1 3 1 3 1 3 2')
  })

  it('Computes padic expansion with decimals.', () => {
    const ratio = new Ratio(-517, 1477)
    const padic = ratio.convertToPadic(7, 11)
    const padic_str = padic.toString()
    expect(padic.valuation).toEqual(-1)
    expect(padic_str).toEqual('1 2 3 4 3 5 4 6 4 1. 1')
  })

  it('Computes padic expansion sum.', () => {
    const ratio = new Ratio(-517, 1477)
    const padic = ratio.convertToPadic(7, 11)
    const sum = padic.dsum()
    expect(sum).toEqual(384219886)
  })

  it('Computes padic complement of the receiver.', () => {
    const ratio = new Ratio(-517, 1477)
    const padic = ratio.convertToPadic(7, 11)
    const cmpt = padic.cmpt()
    const cmpt_str = cmpt.toString()
    expect(cmpt_str).toEqual('5 4 3 2 3 1 2 0 2 5. 6')
  })
})
