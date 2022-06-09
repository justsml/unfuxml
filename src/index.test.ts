import { unfuXml } from "./index"

describe('unfuXml', () => {

  it('can clean adwords soap example', () => {
    const xml = getSampleXml();
    const result = unfuXml(xml);
    expect(result).toEqual({
      "envelope": {
        "body": {
          "getAdUnitsByStatement": {
            "filterStatement": {
              "query": "WHERE parentId IS NULL LIMIT 500",
            },
            "xmlns": "https://www.google.com/apis/ads/publisher/v202205",
          },
        },
        "header": {
          "requestHeader": {
            "actor": "http://schemas.xmlsoap.org/soap/actor/next",
            "applicationName": "DfpApi-Java-2.1.0-dfp_test",
            "mustUnderstand": "0",
            "networkCode": 123456,
            "ns1": "https://www.google.com/apis/ads/publisher/v202205",
          },
        },
        "soapenv": "http://schemas.xmlsoap.org/soap/envelope/",
        "xsd": "http://www.w3.org/2001/XMLSchema",
        "xsi": "http://www.w3.org/2001/XMLSchema-instance",
      },
    });
  });
});

/**
 * 
 * Source: <https://developers.google.com/ad-manager/api/soap_xml#requiredheaders>
 */
function getSampleXml() {
  return `<?xml version="1.0" encoding="UTF-8"?>
  <soapenv:Envelope
          xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"
          xmlns:xsd="http://www.w3.org/2001/XMLSchema"
          xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
    <soapenv:Header>
      <ns1:RequestHeader
           soapenv:actor="http://schemas.xmlsoap.org/soap/actor/next"
           soapenv:mustUnderstand="0"
           xmlns:ns1="https://www.google.com/apis/ads/publisher/v202205">
        <ns1:networkCode>123456</ns1:networkCode>
        <ns1:applicationName>DfpApi-Java-2.1.0-dfp_test</ns1:applicationName>
      </ns1:RequestHeader>
    </soapenv:Header>
    <soapenv:Body>
      <getAdUnitsByStatement xmlns="https://www.google.com/apis/ads/publisher/v202205">
        <filterStatement>
          <query>WHERE parentId IS NULL LIMIT 500</query>
        </filterStatement>
      </getAdUnitsByStatement>
    </soapenv:Body>
  </soapenv:Envelope>`
}