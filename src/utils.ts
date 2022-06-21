import fs from 'fs';
import path from 'path';
import { _cleanupXml, _parseXml } from './unfuxml';
import { UnfuxmlOptions, XmlJsonStatsOptions } from './types';

const numberFormatter = new Intl.NumberFormat('en-US', {
  minimumFractionDigits: 0,
  maximumFractionDigits: 2,
});

function getPercentChange(num1: number, num2: number) {
  return ((num2 - num1) / num1) * 100;
}

function isPathLikeString(str: string) {
  try {
    return !str.includes('\n') && !str.includes('\r') && path.isAbsolute(str);
  } catch (error) {
    console.error(error);
    return false;
  }
}

/**
 * Emits stats about the XML-to-JSON conversion.
 *
 * ```ts
 * getXmlToJsonStats(xmlString, {})
 * {
 *   path: './data/HotelDescriptiveInfoRS.xml',
 *   xmlInputSize: '4,816',
 *   jsonPrettyPreClean: '7,357 (52.76%)',
 *   jsonMinifiedPreClean: '3,145 (-34.70%)',
 *   jsonPrettyClean: '5,559 (15.43%)',
 *   jsonMinifiedClean: '2,655 (-44.87%)'
 * }
 * ```
 *
 * @param {*} xmlPathOrString
 * @param {*} options
 * @returns
 */
export function getXmlToJsonStats(
  xmlPathOrString: string,
  {
    unwrapLists = true,
    includeProcessedJson = false,
    includePercentChange = true,
    formatNumber = true,
    includeRuntime = true,
    currentTimestamp = () => Date.now(),
  }: XmlJsonStatsOptions = {},
  xmlParserOptions: UnfuxmlOptions = { alwaysArray: false }
) {
  const innerFnWrapper = trackExecutionTime(() => {
    const $parseXml = trackExecutionTime(_parseXml);
    const $cleanupXml = trackExecutionTime(_cleanupXml);
    const isXmlFilePath = isPathLikeString(xmlPathOrString);
    const xmlData = isXmlFilePath
      ? fs.readFileSync(xmlPathOrString, 'utf8')
      : xmlPathOrString;

    const parsedJson = $parseXml(xmlData, xmlParserOptions);
    const jsonPrettyPreClean = JSON.stringify(parsedJson, null, 2);
    const jsonMinifiedPreClean = JSON.stringify(parsedJson);
    const parseRuntime = $parseXml.runtime;
    const cleanedJson = $cleanupXml(parsedJson, { unwrapLists });
    const jsonPrettyClean = JSON.stringify(cleanedJson, null, 2);
    const jsonMinifiedClean = JSON.stringify(cleanedJson);
    const cleanupRuntime = $cleanupXml.runtime;

    const getPercentDiff = (sizeToCompare: number) => {
      const displaySize = formatNumber
        ? formatInteger(sizeToCompare)
        : sizeToCompare;
      const percentChange = getPercentChange(xmlData.length, sizeToCompare);
      const signPrefix = percentChange < 0 ? '' : '+';
      return `${displaySize}${
        includePercentChange
          ? ` (${signPrefix}${percentChange.toFixed(2)}%)`
          : ''
      }`;
    };

    const runtime = !includeRuntime
      ? {}
      : {
          runtime: {
            cleanup: cleanupRuntime,
            parse: parseRuntime,
            total: undefined,
          },
        };

    const output = !includeProcessedJson
      ? {}
      : { output: cleanedJson };

    return {
      ...output,
      path: isXmlFilePath ? path.basename(xmlPathOrString) : '[xml-string]',
      ...runtime,
      sizes: {
        input: formatInteger(xmlData.length),
        pretty: {
          preClean: getPercentDiff(jsonPrettyPreClean.length),
          clean: getPercentDiff(jsonPrettyClean.length),
        },
        minified: {
          preClean: getPercentDiff(jsonMinifiedPreClean.length),
          clean: getPercentDiff(jsonMinifiedClean.length),
        },
      },
    };
  });

  const results = innerFnWrapper();
  if (includeRuntime) results.runtime.total = innerFnWrapper.runtime;
  return results;
}

function formatInteger(num: number) {
  return numberFormatter.format(num);
}

type TimedFunction<TFunc = Function> = TFunc & {
  startTime?: number
  runtime?: number
};

const trackExecutionTime: TimedFunction = <TFunc extends Function>(
  fn: TFunc,
  currentTimestamp = () => Date.now()
) => {
  const wrappedFn: TimedFunction = (...args: unknown[]): TimedFunction<TFunc> => {
    const start = currentTimestamp();
    wrappedFn.startTime = start;
    const result = fn(...args);
    if (result?.finally instanceof Function) {
      return result.finally(() => {
        const end = currentTimestamp();
        const time = end - start;
        wrappedFn.runtime = time;
      });
    } else {
      const end = currentTimestamp();
      const time = end - start;
      wrappedFn.runtime = time;
      // console.log(`${fn.name} took ${time}ms`);
      return result;
    }
  };
  return wrappedFn;
};
