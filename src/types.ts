/**
 * Options for `unfuxml(xml, options)`
 */
export type UnfuxmlOptions = CommonOptions & {
  /**
   * By default uses a builtin helper:
   *
   * - removes namespace/schema prefixes.
   * - converts all names using `lodash.camelCase`
   */
  keyNameFunction?: (value: string) => string

};

export interface CommonOptions {
  /**
   * Collapses nested keys named with plural suffixes.
   * @default true
   */
  unwrapLists?: boolean

  /**
   * Define a list of keys which should always be treated as arrays.
   *
   * >**MUST** match the names AFTER the name transformer runs against the source XML.
   *
   * @default false
   */
  alwaysArray?: boolean | string[]
}

/**
 * @see getXmlToJsonStats()
 */
export type XmlJsonStatsOptions = CommonOptions & {
  /**
   * Defaults to `false` so measurements are not thrown off by the
   * length of your input & output data.
   * @default false
   */
  includeProcessedJson?: boolean
  /**
   * For human convenience.
   * @default true
   */
  includePercentChange?: boolean
  /**
   * Adds comma separators.
   * @default true
   */
  formatNumber?: boolean

  /**
   * Returns Runtime stats.
   * @default true
   */
  includeRuntime?: boolean

  /**
   * - Low-precision on Browsers/Node, use `() => Date.now()`
   * - High-precision on Node, use `() => performance.now()`
   *
   * Only used if `includeRuntime` is `true`.
   *
   * @default () => Date.now()
   */
  currentTimestamp?: () => number
};

export type CleanupJsonXmlOptions = CommonOptions & {
  /**
   * Do not change. `xml-js` is configured to emit an _attributes key with the element's attributes.
   * @default '_attributes'
   */
  spreadKey?: string
  /**
   * Do not change. This key will be assigned to the `.value``xml-js` is configured to emit an _text key with the element's text.
   * @default '_text'
   */
  spreadOrSetValue?: string
};
