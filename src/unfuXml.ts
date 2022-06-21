import convert from 'xml-js';
import camelCase from 'lodash/camelCase.js';
import omit from 'lodash/omit.js';

import { UnfuxmlOptions, CleanupJsonXmlOptions } from './types';

export default unfuxml;

export function unfuxml<TExpectedOutput extends object = object>(
  xmlData: string,
  xmlParserOptions: UnfuxmlOptions & CleanupJsonXmlOptions = {}
): TExpectedOutput {
  const parsedJson = _parseXml(xmlData, xmlParserOptions);
  const cleanedJson = _cleanupXml(parsedJson, xmlParserOptions);
  return cleanedJson as unknown as TExpectedOutput;
}

export function _parseXml(xmlData: string, {
  alwaysArray = false,
  keyNameFunction = fixVariableName,
}: UnfuxmlOptions = {}
) {
  return JSON.parse(convert.xml2json(xmlData, {
    compact: true,
    // ignoreCdata: true,
    ignoreComment: true,
    ignoreDeclaration: true,
    ignoreDoctype: true,
    ignoreInstruction: true,
    nativeType: true,
    spaces: 2,
    trim: true,
    alwaysArray,
    elementNameFn: keyNameFunction,
    attributeNameFn: keyNameFunction,
    instructionNameFn: keyNameFunction,
  }));
}

function isEmptyObject(obj: object | null | unknown) {
  return typeof obj === 'object' &&
  obj !== null &&
  Object.keys(obj).length === 0;
}

function removeEmptyArrays(
  json: object | object[] | any,
  key: string,
  value: unknown | Record<string, unknown>,
  alwaysArray: CleanupJsonXmlOptions['alwaysArray']
): Record<string, unknown> | [] {
  // if (key.startsWith('state')) process.stdout.write(`\n${key}: ${JSON.stringify(value)} (${alwaysArray})\n`);
  if (!alwaysArray || !Array.isArray(alwaysArray)) return json as Record<string, unknown>;
  if (alwaysArray.includes(key) && Array.isArray(value) && value?.length === 1)
    if (isEmptyObject(value[0])) return { [key]: [] };

  return json as Record<string, unknown>;
}

export function _cleanupXml(json: string | Record<string, unknown>, {
  spreadKey = '_attributes',
  spreadOrSetValue = '_text',
  unwrapLists = true,
  alwaysArray = false,
}: CleanupJsonXmlOptions = {}) {
  if (typeof json === 'string') json = JSON.parse(json);
  if (typeof json !== 'object') throw Error('Failed to parse json');
  const keys = Object.keys(json);

  if (keys.length === 1 && keys.includes(spreadOrSetValue)) {
    // @ts-expect-error
    json = json[spreadOrSetValue];
  } else if (keys.length === 1 && keys.includes(spreadKey)) {
    // @ts-expect-error
    json = json[spreadKey];
  } else if (keys.includes(spreadKey) && typeof json === 'object') {
    json = extractAndFlattenByKey(json, spreadKey);
    // Duplicate the check on spreadOrSetValue
    json = moveContentToValueKey(json, keys, spreadOrSetValue);
  }
  // Before enumerating `json`'s keys, ensure it's an object
  if (typeof json !== 'object' || Object.keys(json).length <= 0) return json;

  if (typeof json !== 'string') {
    for (const key in json) {
      if (Object.hasOwnProperty.call(json, key)) {
        // @ts-expect-error
        const value = json[key];
        if (typeof value === 'object' && value != null) {
          // @ts-expect-error
          if (unwrapLists && value != null) json = collapseNestedList(json, key, value);
          // if (key.startsWith('state')) process.stdout.write(`\n\tPre: ${key}: ${JSON.stringify(json)}\n`);
          // @ts-expect-error
          if (alwaysArray) json = removeEmptyArrays(json, key, value, alwaysArray);
          // if (key.startsWith('state')) process.stdout.write(`\n\tPost:${key}: ${JSON.stringify(json)}\n`);
          // @ts-expect-error
          json[key] = _cleanupXml(json[key], { spreadKey, spreadOrSetValue, unwrapLists });
        } else {
          // @ts-expect-error
          json[key] = value;
        }
      }
    }
  }
  return json;
}

function collapseNestedList(json: Record<string, unknown>, key: string, value: unknown | Record<string, unknown>) {
  if (typeof value === 'object' && value != null) {
    const keys = Object.keys(value);
    if (keys.length === 1 && checkRelatedKeys(keys[0], key)) {
      // @ts-expect-error
      json[key] = value[keys[0]];
    }
  }
  return json;
}

/**
 * Handles common (English) suffixes.
 *
 * Examples:
 *
 * - `Technologies` -> `Technology` = ✅
 * - `Entries` -> `Entry` = ✅
 * - `Lies` -> `Lie` = ✅
 * - `DJs` -> `DJ` = ✅
 * - `States` -> `State` = ✅
 * - `StateList` -> `State` = ✅
 *
 */
function checkRelatedKeys(keyA: string, keyB: string) {
  keyA = keyA.replace(/(ies$)|(s$)|(y$)/ig, '');
  keyB = keyB.replace(/(List$)|(Set$)|(ies$)|(s$)/g, '');
  return keyB.startsWith(keyA);
}

function moveContentToValueKey(
  json: Record<string, unknown>,
  keys: string[],
  spreadOrSetValue: string
) {
  if (keys.includes(spreadOrSetValue) && !Object.hasOwnProperty.call(json, 'value'))
    json.value = json[spreadOrSetValue];
  json = omit(json, spreadOrSetValue);
  return json;
}

function extractAndFlattenByKey(
  json: Record<string, unknown>,
  spreadKey: string
) {
  // @ts-expect-error
  const properties = { ...json[spreadKey] };
  json = omit(json, spreadKey);
  json = { ...json, ...properties };
  return json;
}

/**
 * The `fixVariableName` function is a builtin helper:
 *
 * - Removes namespace/schema prefixes.
 * - Converts all names using `lodash.camelCase`
 *
 * > You can use your own function to convert names.
 *
 *
 * > Extend behavior by utilizing the named export in your code:
 *
 * ```ts
 * function customNameTransformer(name: string) {
 *   let customName = fixVariableName(name);
 *   // Custom re-map a few key names
 *   if (customName === 'baserate') customName = 'baseRate';
 *   if (customName === 'checkin') customName = 'checkIn';
 *   return customName; // NOTE: Don't forget to return the name!
 * }
 *
 * // Usage:
 * unfuxml(xmlData, { keyNameFunction: customNameTransformer });
 * ```
 */
export function fixVariableName(value: string) {
  value = value.replace(/^([^:]+:)?(.*)/ig, '$2');
  value = camelCase(value);
  return value;
}

export const _testHelpers = {
  fixVariableName,
  checkRelatedKeys,
};
