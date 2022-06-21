/* eslint-disable @typescript-eslint/prefer-ts-expect-error */
import { unfuxml, getXmlToJsonStats } from './index';
import { XmlJsonStatsOptions } from './types';
import { XmlFixtures } from './__fixtures__';

describe('unfuxml', () => {
  it('can clean adWords soap example', () => {
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

  it('can unwrap "*List" suffixed arrays', () => {
    const result = unfuxml(XmlFixtures.StateList, {
      unwrapLists: true,
      alwaysArray: ['StateList'],
    });
    // process.stdout.write('Test #1' + JSON.stringify(result, null, 2) + '\n');
    expect(result).toEqual({
      stateList: [
        { name: 'CA' },
        { name: 'CO' },
        { name: 'WA' },
      ],
    });
  });

  it('can preserve object nesting', () => {
    const result = unfuxml(XmlFixtures.StateList, {
      unwrapLists: false,
      alwaysArray: ['StateList'],
    });
    // process.stdout.write('Test #1 ' + JSON.stringify(result, null, 2) + '\n');
    expect(result).toEqual({
      stateList: {
        state: [
          { name: 'CA' },
          { name: 'CO' },
          { name: 'WA' },
        ],
      },
    });
  });

  it('can output empty array when no child nodes present', () => {
    const result = unfuxml(XmlFixtures.StateSetEmptyList, {
      alwaysArray: ['stateList'],
    });
    expect(result).toHaveProperty('stateList');
    // @ts-ignore
    expect(result?.stateList).toHaveLength(0);
  });

  it('can preserve arrays with a single child node', () => {
    const result = unfuxml(XmlFixtures.StateSetOfOne, {
      alwaysArray: ['stateList'],
    });
    expect(result).toHaveProperty('stateList');
    // @ts-ignore
    expect(result?.stateList).toHaveLength(1);
  });
  it('can handle mixed-node lists (PolymorphicNodes)', () => {
    const result = getXmlToJsonStats(XmlFixtures.PolymorphicNodeList, {
      includeProcessedJson: true,
      includeRuntime: false,
    });
    expect(result).toMatchSnapshot('stats');
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
  it('TransactionMultiRate: Defaults', () => {
    const result = getXmlToJsonStats(XmlFixtures.TransactionMultiRate, opts);
    expect(result).toMatchSnapshot('usingDefaults');
  });
  it('TransactionMultiRate: Preserve original wrapping', () => {
    const myOpt: XmlJsonStatsOptions = { ...opts, unwrapLists: false };
    const result = getXmlToJsonStats(XmlFixtures.TransactionMultiRate, myOpt);
    // process.stdout.write('Test #2' + JSON.stringify(result, null, 2) + '\n');
    expect(result).toMatchSnapshot('preserveWrapping');
  });
  it('TransactionMultiRate: Unwrapped Lists', () => {
    const myOpt = { ...opts, unwrapLists: true };
    const result = getXmlToJsonStats(XmlFixtures.TransactionMultiRate, myOpt);
    const { rates } = result.output?.transaction?.result;
    // process.stdout.write('Test #3' + JSON.stringify(result, null, 2) + '\n');
    expect(typeof result.output.transaction.result).toBe('object');
    expect(Array.isArray(rates)).toBe(true);
    expect(result).toMatchSnapshot('applyUnwrapping');
  });
});
