import camelCase from 'lodash/camelCase.js';
import omit from 'lodash/omit.js';
import convert from 'xml-js';

export interface XmlParserOptions {
  alwaysArray?: boolean | string[]
  fixKeyNameFunction?: (value: string) => string
}

export function unfuXml(xmlData: string, xmlParserOptions: XmlParserOptions = {}): object {
  const parsedJson = _parseXml(xmlData, xmlParserOptions);
  const cleanedJson = _cleanupXml(parsedJson);
  return cleanedJson as object;
}

export function _parseXml(xmlData: string, { alwaysArray = false, fixKeyNameFunction = fixVariableName }: XmlParserOptions = {}) {
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

export function _cleanupXml(json: string | Record<string, unknown>, spreadKey = '_attributes', spreadOrSetValue = '_text') {
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
    // @ts-expect-error
    const properties = { ...json[spreadKey] };
    json = omit(json, spreadKey);
    json = { ...json, ...properties };
    // Duplicate the check on spreadOrSetValue
    // @ts-expect-error
    if (keys.includes(spreadOrSetValue) && !Object.hasOwnProperty.call(json, 'value')) json.value = json[spreadOrSetValue];
    // @ts-expect-error
    json = omit(json, spreadOrSetValue);
  }
  if (typeof json !== 'object' || Object.keys(json).length <= 0) return json;

  for (const key in json) {
    if (Object.hasOwnProperty.call(json, key)) {
      const value = json[key];
      if (typeof json[key] === 'object') {
        // @ts-expect-error
        json[key] = _cleanupXml(json[key], spreadKey, spreadOrSetValue);
      } else {
        json[key] = value;
      }
    }
  }
  return json;
}

function fixVariableName(value: string) {
  value = value.replace(/^(\w+:)?(.*)/ig, '$2');
  value = camelCase(value);
  return value;
}
