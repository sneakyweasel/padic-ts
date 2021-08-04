import Ratio from '../../src/engine/Ratio'

describe('Ratio', () => {
  it('Errors when denominator is zéro.', () => {
    const t = () => {
      new Ratio(1, 0)
    }
    expect(t).toThrow("Can't divide by 0.")
  })

  // UNARY OPERATIONS
  it('Negates a ratio.', () => {
    const rat1 = new Ratio(12, 5, -1)
    expect(rat1.neg().toString()).toEqual('12/5')
    const rat2 = new Ratio(12, 5)
    expect(rat2.neg().toString()).toEqual('-12/5')
  })

  it('Inverts a ratio.', () => {
    const rat1 = new Ratio(12, 5, -1)
    expect(rat1.inverse().toString()).toEqual('-5/12')
    const rat2 = new Ratio(12, 5)
    expect(rat2.inverse().toString()).toEqual('5/12')
  })

  it('Gives an absolute value for a ratio.', () => {
    const rat1 = new Ratio(12, 5, -1)
    expect(rat1.abs().toString()).toEqual('12/5')
    const rat2 = new Ratio(12, 5)
    expect(rat2.abs().toString()).toEqual('12/5')
  })

  it('Reduces a ratio to minimal form.', () => {
    const rat1 = new Ratio(12, 4)
    expect(rat1.reduce().toString()).toEqual('3')
    const rat2 = new Ratio(12, 60)
    expect(rat2.reduce().toString()).toEqual('1/5')
    const rat3 = new Ratio(-12, 60, -1)
    expect(rat3.reduce().toString()).toEqual('1/5')
  })

  // BINARY OPERATIONS
  it('Adds two ratios.', () => {
    const rat1 = new Ratio(12, 5)
    const rat2 = new Ratio(12, 5, -1)
    expect(rat1.add(rat2).toString()).toEqual('0')
    const rat3 = new Ratio(12, 5)
    const rat4 = new Ratio(12, 5)
    expect(rat3.add(rat4).reduce().toString()).toEqual('24/5')
  })

  it('Substract two ratios.', () => {
    const rat1 = new Ratio(12, 5)
    const rat2 = new Ratio(12, 5)
    expect(rat1.sub(rat2).toString()).toEqual('0')
    const rat3 = new Ratio(12, 1)
    const rat4 = new Ratio(5, 1, -1)
    expect(rat3.sub(rat4).reduce().toString()).toEqual('17')
    const rat5 = new Ratio(12, 3)
    const rat6 = new Ratio(5, 2)
    expect(rat5.sub(rat6).reduce().toString()).toEqual('3/2')
  })

  it('Multiplies two ratios.', () => {
    const rat1 = new Ratio(12, 5)
    const rat2 = new Ratio(12, 5)
    expect(rat1.mul(rat2).toString()).toEqual('144/25')
    const rat3 = new Ratio(12)
    const rat4 = new Ratio(-5)
    expect(rat3.mul(rat4).reduce().toString()).toEqual('-60')
    const rat5 = new Ratio(12, 3)
    const rat6 = new Ratio(5, 2)
    expect(rat5.mul(rat6).reduce().toString()).toEqual('10')
  })
})
