import { formateCurrency } from '../../scripts/utils/money.js';

describe('test suite : for formateCurrency', () => {

  it('convert cents into dollars', () => {
    expect(formateCurrency(2095)).toEqual('20.95');
  });
  it('workd with zero', () => {
    expect(formateCurrency(0)).toEqual('0.00');
  });
  it('round up to the nearest cent', () => {
    expect(formateCurrency(2000.5)).toEqual('20.01');
    expect(formateCurrency(2000.4)).toEqual('20.00');

  });
});
