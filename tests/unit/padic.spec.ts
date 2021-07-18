import { Ratio, Padic } from '../../src/engine/Padic'
import { presets } from '../../src/engine/data'

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

  it('Adds two padic numbers.', () => {
    for (const preset of presets) {
      const ratio1 = new Ratio(preset.n1, preset.d1)
      const padic1 = ratio1.convertToPadic(preset.p, preset.k)
      const ratio2 = new Ratio(preset.n2, preset.d2)
      const padic2 = ratio2.convertToPadic(preset.p, preset.k)
      const result = padic1.add(padic2)
      const result_str = result.toString()
      expect(result_str).toEqual(preset.exp)
    }
  })

  xit('Converts to ratio.', () => {
    const ratio = new Ratio(1, 2)
    const padic = ratio.convertToPadic(5, 10)
    const padic_str = padic.toString()
    // expect(padic.valuation).toEqual(0)
    // expect(padic_str).toEqual('3 1 3 1 3 1 3 1 3 2')
    const ratio_reconstruct = padic.convertToRatio().toString()
    expect(ratio_reconstruct).toEqual('1/3')
  })
})
