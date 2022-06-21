import camelCase from 'lodash/camelCase.js';
import omit from 'lodash/omit.js';
import convert from 'xml-js';
import { XmlParserOptions } from './types';

export default unfuxml;

export function unfuxml(xmlData: string, xmlParserOptions: XmlParserOptions = {}): object {
  const parsedJson = _parseXml(xmlData, xmlParserOptions);
  const cleanedJson = _cleanupXml(parsedJson);
  return cleanedJson as object;
}

export function _parseXml(xmlData: string, {
  alwaysArray = false,
  fixKeyNameFunction = fixVariableName,
}: XmlParserOptions = {}
) {
  return JSON.parse(convert.xml2json(xmlData, {
    compact: true,
    spaces: 2,
    ignoreDeclaration: true,
    ignoreDoctype: true,
    ignoreInstruction: true,
    ignoreComment: true,
    nativeType: true,
    trim: true,
    alwaysArray,
    elementNameFn: fixKeyNameFunction,
    attributeNameFn: fixKeyNameFunction,
    instructionNameFn: fixKeyNameFunction,
  }));
}

export function _cleanupXml(json: string | Record<string, unknown>, {
  spreadKey = '_attributes',
  spreadOrSetValue = '_text',
  collapseNestedLists = false,
}: {
  spreadKey?: string
  spreadOrSetValue?: string
  collapseNestedLists?: boolean
} = {}) {
  if (typeof json === 'string') json = JSON.parse(json);
  if (typeof json === 'string') throw Error('Failed to parse json');
  const keys = Object.keys(json);

  if (keys.length === 1 && keys.includes(spreadOrSetValue)) {
    // @ts-expect-error
    json = json[spreadOrSetValue];
  } else if (keys.length === 1 && keys.includes(spreadKey)) {
    // @ts-expect-error
    json = json[spreadKey];
  } else if (keys.includes(spreadKey)) {
    json = extractAndFlattenByKey(json, spreadKey);
    // Duplicate the check on spreadOrSetValue
    json = moveContentToValueKey(json, keys, spreadOrSetValue);
  }
  // Before enumerating `json`'s keys, ensure it's an object
  if (typeof json !== 'object' || Object.keys(json).length <= 0) return json;

  for (const key in json) {
    if (Object.hasOwnProperty.call(json, key)) {
      const value = json[key];
      if (typeof value === 'object') {
        if (collapseNestedLists && value != null) json = collapseNestedList(json, key, value);
        // @ts-expect-error
        json[key] = _cleanupXml(json[key], { spreadKey, spreadOrSetValue, collapseNestedLists });
      } else {
        json[key] = value;
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

function checkRelatedKeys(keyA: string, keyB: string) {
  return keyB.startsWith(keyA);
}

function moveContentToValueKey(json: Record<string, unknown>, keys: string[], spreadOrSetValue: string) {
  if (keys.includes(spreadOrSetValue) && !Object.hasOwnProperty.call(json, 'value'))
    json.value = json[spreadOrSetValue];
  json = omit(json, spreadOrSetValue);
  return json;
}

function extractAndFlattenByKey(json: Record<string, unknown>, spreadKey: string) {
  // @ts-expect-error
  const properties = { ...json[spreadKey] };
  json = omit(json, spreadKey);
  json = { ...json, ...properties };
  return json;
}

function fixVariableName(value: string) {
  value = value.replace(/^(\w+:)?(.*)/ig, '$2');
  value = camelCase(value);
  return value;
}
