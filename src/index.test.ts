import { unfuxml, getXmlToJsonStats } from './index';
import { XmlFixtures } from './__fixtures__';

describe('unfuxml', () => {
  it('can clean adwords soap example', () => {
    const result = unfuxml(XmlFixtures.GoogleAdManagerQuery);

    expect(result).toEqual({
      envelope: {
        body: {
          getAdUnitsByStatement: {
            filterStatement: {
              query: 'WHERE parentId IS NULL LIMIT 500',
            },
            xmlns: 'https://www.google.com/apis/ads/publisher/v202205',
          },
        },
        header: {
          requestHeader: {
            actor: 'http://schemas.xmlsoap.org/soap/actor/next',
            applicationName: 'DfpApi-Java-2.1.0-dfp_test',
            mustUnderstand: '0',
            networkCode: 123456,
            ns1: 'https://www.google.com/apis/ads/publisher/v202205',
          },
        },
        soapenv: 'http://schemas.xmlsoap.org/soap/envelope/',
        xsd: 'http://www.w3.org/2001/XMLSchema',
        xsi: 'http://www.w3.org/2001/XMLSchema-instance',
      },
    });
  });
});

describe('getXmlToJsonStats', () => {
  const opts = {
    includeProcessedJson: true,
    includeRuntime: false,
  };
  it('BaseRateWithConditionalRates', () => {
    const result = getXmlToJsonStats(XmlFixtures.BaseRateWithConditionalRates, opts);
    expect(result).toMatchSnapshot('stats');
  });
  it('PropertyData', () => {
    const result = getXmlToJsonStats(XmlFixtures.PropertyData, opts);
    expect(result).toMatchSnapshot('stats');
  });
  it('RateModifications', () => {
    const result = getXmlToJsonStats(XmlFixtures.RateModifications, opts);
    expect(result).toMatchSnapshot('stats');
  });
  it('SingleOccupancyBundle', () => {
    const result = getXmlToJsonStats(XmlFixtures.SingleOccupancyBundle, opts);
    expect(result).toMatchSnapshot('stats');
  });
  it('Transaction', () => {
    const result = getXmlToJsonStats(XmlFixtures.Transaction, opts);
    expect(result).toMatchSnapshot('stats');
  });
  it('TransactionMultiRate', () => {
    const result = getXmlToJsonStats(XmlFixtures.TransactionMultiRate, opts);
    expect(result).toMatchSnapshot('stats');
  });
  it('TransactionMultiRate: Unwrapped Lists', () => {
    const myOpt = { ...opts, collapseNestedLists: true };
    const result = getXmlToJsonStats(XmlFixtures.TransactionMultiRate, myOpt);
    const { rates } = result.output?.transaction?.result;

    expect(typeof result.output.transaction.result).toBe('object');
    expect(Array.isArray(rates)).toBe(true);
    expect(result).toMatchSnapshot('stats');
  });
});
