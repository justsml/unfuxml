/**
 * Credit: **Google Developer Docs**
 *
 * - https://developers.google.com/
 * - https://developers.google.com/hotels/hotel-prices/xml-reference/transaction-messages#transaction-examples
 * - https://developers.google.com/ad-manager/api/soap_xml#requiredheaders
 *
 */
export const XmlFixtures = {
  /** Awkward jumbling of node types */
  PolymorphicNodeList: `<?xml version="1.0" encoding="utf-8"?>
<Plan importance="high" logged="true">
  <title>Daily tasks</title>
  <todo>Work</todo>
  <todo>Play</todo>
</Plan>`,
  /** Lists example */
  StateList: `<?xml version="1.0" encoding="UTF-8"?>
<StateList>
  <State name="CA" />
  <State name="CO" />
  <State name="WA" />
</StateList>`,
  /** Lists example */
  StateSetOfOne: `<?xml version="1.0" encoding="UTF-8"?>
<StateList>
  <State name="CO" />
</StateList>`,
  /** Lists example */
  StateSetEmptyList: `<?xml version="1.0" encoding="UTF-8"?>
<StateList></StateList>`,

  /**
   * Source: <https://developers.google.com/ad-manager/api/soap_xml#requiredheaders>
   */
  GoogleAdManagerQuery: `<?xml version="1.0" encoding="UTF-8"?>
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
  </soapenv:Envelope>`,
  RateModifications: `<?xml version="1.0" encoding="UTF-8"?>
  <RateModifications partner="partner_key" id="B78BA3ED-31C5-44D7-80F7-69E12AEAA1BD" timestamp="timestamp">
    <HotelRateModifications hotel_id="hotel-id-123-abc" action="overlay">
      <ItineraryRateModification id="357238795" action="delete">
        <BookingDates>
          <DateRange start="2030-04-15" end="2030-04-15" days_of_week="M" />
          <DateRange start="2030-04-15" end="2030-04-15" days_of_week="M" />
        </BookingDates>
        <BookingWindow min="integer" max="integer" />
        <CheckinDates>
          <DateRange start="2030-04-15" end="2030-04-15" days_of_week="M" />
        </CheckinDates>
        <CheckoutDates>
          <DateRange start="2030-04-15" end="2030-04-15" days_of_week="M" />
        </CheckoutDates>
        <Devices>
          <Device type="desktop" />
        </Devices>
        <LengthOfStay min="integer" max="integer" />
        <MinimumAmount before_discount="integer" />
        <RatePlans>
          <RatePlan id="PackageID_1" />
          <RatePlan id="PackageID_2" />
        </RatePlans>
        <RoomTypes>
          <RoomType id="RoomID_1" />
          <RoomType id="RoomID_2" />
        </RoomTypes>
        <StayDates application="all">
          <DateRange start="2030-04-15" end="2030-04-15" days_of_week="M" />
        </StayDates>
        <UserCountries type="include">
          <Country code="USA" />
        </UserCountries>
        <ModificationActions>
          <PriceAdjustment multiplier="float" />
          <RateRule id="9876" />
          <Refundable available="false" refundable_until_days="1" refundable_until_time="time" />
          <Availability status="unavailable" />
        </ModificationActions>
      </ItineraryRateModification>
    </HotelRateModifications>
  </RateModifications>`,
  /** Credit: https://developers.google.com/hotels/hotel-prices/xml-reference/ */
  Transaction: `<?xml version="1.0" encoding="UTF-8"?>
  <Transaction timestamp="2017-07-18T16:20:00-04:00" id="42">
    <PropertyDataSet>
      <Property>1234</Property>
      <RoomData>
        <RoomID>5440OF</RoomID>
        <Name>
          <Text text="Single King Bed Room" language="en"/>
          <Text text="Simple Lit de Roi" language="fr"/>
        </Name>
        <Description>
          <Text text="One king bed with pillowtop mattresses, 300-thread-count linens,
            and down comforters (bedspreads). City view. 300 square feet. Desk with
            rolling chair. Multi-line phone with voice mail. Cable/satellite TV with
            complimentary HBO and pay movies." language="en"/>
          <Text text="Un très grand lit avec matelas à plateau-coussin, ..." language="fr"/>
        </Description>
        <PhotoURL>
          <Caption>
            <Text text="Bathroom View" language="en"/>
            <Text text="La salle de baines" language="fr"/>
          </Caption>
          <URL>http://www.foo.com/static/bar/image1234.jpg</URL>
        </PhotoURL>
        <Capacity>4</Capacity>
      </RoomData>
    </PropertyDataSet>
  </Transaction>`,
  /** Credit: https://developers.google.com/hotels/hotel-prices/xml-reference/ */
  PropertyData: `<?xml version="1.0" encoding="UTF-8"?>
  <Transaction timestamp="2017-07-18T16:20:00-04:00" id="42">
    <!-- A transaction message with room types result. -->
    <PropertyDataSet>
      <Property>12345</Property>
      <RoomData>
        <RoomID>single</RoomID>
        <Name>
          <Text text="Single room" language="en"/>
          <Text text="Chambre simple" language="fr"/>
        </Name>
        <Description>
          <Text text="A single room" language="en"/>
          <Text text="Le chambre simple" language="fr"/>
        </Description>
        <PhotoURL>
          <Caption>
            <Text text="Living area" language="en"/>
            <Text text="Le chambre" language="fr"/>
          </Caption>
          <URL>http://www.foo.com/static/bar/image1234.jpg</URL>
        </PhotoURL>
        <PhotoURL>
          <URL>http://www.foo.com/static/bar/image1235.jpg</URL>
        </PhotoURL>
        <Capacity>2</Capacity>
      </RoomData>
      <RoomData>
        <RoomID>double</RoomID>
        <Name>
          <Text text="Double room" language="en"/>
          <Text text="Chambre double" language="fr"/>
        </Name>
        <Occupancy>1</Occupancy>
      </RoomData>
      <PackageData>
        <PackageID>refundbreakfast</PackageID>
        <Name>
          <Text text="Refundable Room with Breakfast" language="en"/>
          <Text text="Chambre remboursable avec le petit déjeuner" language="fr"/>
        </Name>
        <Description>
          <Text text="Continental Breakfast" language="en"/>
          <Text text="Petit déjeuner continental" language="fr"/>
        </Description>
        <ChargeCurrency>hotel</ChargeCurrency>
        <Refundable available="1" refundable_until_days="3"/>
        <BreakfastIncluded>1</BreakfastIncluded>
      </PackageData>
      <PackageData>
        <PackageID>prepaid</PackageID>
        <Name>
          <Text text="Nonrefundable" language="en"/>
          <Text text="Non remboursable" language="fr"/>
        </Name>
        <Description>
          <Text text="Blah blah blad" language="en"/>
          <Text text="Le blah blah blad" language="fr"/>
        </Description>
        <Occupancy>2</Occupancy>
        <ChargeCurrency>web</ChargeCurrency>
        <Refundable available="0"/>
      </PackageData>
    </PropertyDataSet>
  </Transaction>`,
  /** Credit: https://developers.google.com/hotels/hotel-prices/xml-reference/ */
  TransactionMultiRate: `<?xml version="1.0" encoding="UTF-8"?>
  <Transaction timestamp="2020-07-23T16:20:00-04:00" id="42">
    <Result>
      <Property>1234</Property>
      <Checkin>2021-01-13</Checkin>
      <Nights>9</Nights>
      <Baserate currency="USD">3196.1</Baserate>
      <Tax currency="USD">559.49</Tax>
      <OtherFees currency="USD">543.34</OtherFees>
      <Occupancy>2</Occupancy>
      <Rates>
        <Rate>
          <Baserate currency="USD">3196.1</Baserate>
          <Tax currency="USD">559.49</Tax>
          <OtherFees currency="USD">543.34</OtherFees>
          <Occupancy>1</Occupancy>
        </Rate>
        <Rate>
          <Baserate currency="USD">3196.1</Baserate>
          <Tax currency="USD">559.49</Tax>
          <OtherFees currency="USD">543.34</OtherFees>
          <Occupancy>3</Occupancy>
        </Rate>
        <Rate>
          <Baserate currency="USD">3196.1</Baserate>
          <Tax currency="USD">559.49</Tax>
          <OtherFees currency="USD">543.34</OtherFees>
          <Occupancy>4</Occupancy>
        </Rate>
        <Rate>
          <Baserate currency="USD">3196.1</Baserate>
          <Tax currency="USD">559.49</Tax>
          <OtherFees currency="USD">543.34</OtherFees>
          <Occupancy>5</Occupancy>
        </Rate>
        <Rate>
          <Baserate currency="USD">3196.1</Baserate>
          <Tax currency="USD">559.49</Tax>
          <OtherFees currency="USD">543.34</OtherFees>
          <Occupancy>6</Occupancy>
        </Rate>
      </Rates>
    </Result>
  </Transaction>`,
  /** Credit: https://developers.google.com/hotels/hotel-prices/xml-reference/ */
  BaseRateWithConditionalRates: `<?xml version="1.0" encoding="UTF-8" ?>
  <Transaction timestamp="2017-07-18T16:20:00-04:00" id="42">
    <Result>
      <Property>1234</Property>
      <Checkin>2018-06-10</Checkin>
      <Nights>2</Nights>
  
      <!-- Any attribute listed below will not be inherited between bundles
           or baserates. -->
      <!-- The baserate attribute is optional. -->
      <!-- If a baserate is provided, the pricing must match a specific roombundle
      price provided below. -->
      <Baserate currency="USD">300.00</Baserate>
      <Tax currency="USD">30.00</Tax>
      <OtherFees currency="USD">2.00</OtherFees>
  
      <!-- When Google receives new room bundle information for an itinerary, all
      previous room bundle pricing is dropped from Google's cache. Thus, if you
      want to delete a specific room bundle from Google's cache, you may do so
      by simply not providing that specific room bundle in subsequent transaction
      messages. -->
      <RoomBundle>
       ...
        <!-- RoomID is required, PackageID is recommended. -->
        <RoomID>5</RoomID>
        <PackageID>ABC</PackageID>
        <!-- Baserate is required. -->
        <Baserate currency="USD">275.00</Baserate>
        <Tax currency="USD">27.50</Tax>
        <OtherFees currency="USD">2.00</OtherFees>
  
        <!-- RatePlanID is optional and represents the unique identifier for a
        room and package data combination. We strongly recommend using RatePlanID
        as a variable to build your dynamic landing page (formerly Point of Sale)
        URL. For details, see Using Variables and Conditions. -->
        <RatePlanID>5-ABC</RatePlanID>
  
        <!-- Occupancy is mandatory for RoomBundle elements. -->
        <!-- Elements below will get inherited to nested rate elements. -->
        <Occupancy>2</Occupancy>
        <OccupancyDetails>
          <NumAdults>2</NumAdults>
        </OccupancyDetails>
        <InternetIncluded>1</InternetIncluded>
  
  
        <!-- Rate rule "mobile" overrides chargeCurrency, "us_or_gb" doesn't. -->
        <ChargeCurrency>web</ChargeCurrency>
        <Custom1>ratebasic</Custom1>
        <!-- Neither rate overrides Custom2. -->
        <Custom2>ratebasic</Custom2>
  
        <Rates>
          <Rate rate_rule_id="mobile">
            <Baserate currency="USD">258.33</Baserate>
            <Tax currency="USD">25.83</Tax>
            <OtherFees currency="USD">1.00</OtherFees>
            <!-- The value below overrides ChargeCurrency from roombundle. -->
            <ChargeCurrency>hotel</ChargeCurrency>
            <!-- The value below overrides Custom1 from roombundle. -->
            <Custom1>ratecode321</Custom1>
            <!-- Custom2 is inherited from roombundle. -->
          </Rate>
          <Rate rate_rule_id="us_or_gb">
            <Baserate currency="USD">268.33</Baserate>
            <Tax currency="USD">26.83</Tax>
            <OtherFees currency="USD">1.00</OtherFees>
            <!-- The value below overrides Custom1 from roombundle. -->
            <Custom1>ratecode432</Custom1>
            <!-- Custom2 is inherited from roombundle. -->
          </Rate>
        </Rates>
      </RoomBundle>
    </Result>
  </Transaction>`,
  /** Credit: https://developers.google.com/hotels/hotel-prices/xml-reference/ */
  SingleOccupancyBundle: `<?xml version="1.0" encoding="UTF-8" ?>
  <!-- Efficient method of defining Room Bundles-->
  <Transaction timestamp="2017-07-18T16:20:00-04:00" id="12345678">
    <!-- Part1: Define RoomData and PackageData in PropertyDataSet -->
    <!-- Note:  Once defined it does not have to be repeated for future
                Transaction Messages.
                PropertyDataSets can also be defined and sent in their own
                Transaction Message separately from pricing. Google can be
                configured to pull just PropertyDataSets once per day
                (or on a predefined frequency). -->
    <PropertyDataSet>
      <Property>180054</Property>
      <!-- Can be reused by multiple Room Bundles -->
      <RoomData>
        <RoomID>060773</RoomID>
        <Name>
          <Text text="Single Queen Room - Non-Smoking" language="en"/>
          <Text text="Chambre de la Roi Premium - Pas de Fumeurs" language="fr"/>
        </Name>
        <!-- Room can accommodate up to 4, but package data specifies occupancy
             between 1 to 4 -->
        <Capacity>4</Capacity>
      </RoomData>
      <RoomData>
        <RoomID>436233</RoomID>
        <Name>
          <Text text="Premium King Room - Non-Smoking" language="en"/>
          <Text text="Chambre de le Roi Premium - Pas de Fumeurs" language="fr"/>
        </Name>
        <Capacity>4</Capacity>
      </RoomData>
      <!-- Can be reused by multiple Room Bundles -->
      <PackageData>
        <PackageID>P11111</PackageID>
        <Occupancy>1</Occupancy>
        <ChargeCurrency>web</ChargeCurrency>
        <Refundable available="1" refundable_until_days="7"
             refundable_until_time="18:00:00"/>
        <ParkingIncluded>1</ParkingIncluded>
        <InternetIncluded>1</InternetIncluded>
      </PackageData>
      <PackageData>
        <PackageID>P54321</PackageID>
        <Occupancy>2</Occupancy>
        <ChargeCurrency>web</ChargeCurrency>
        <Refundable available="1" refundable_until_days="7"
             refundable_until_time="18:00:00"/>
        <ParkingIncluded>1</ParkingIncluded>
        <InternetIncluded>1</InternetIncluded>
      </PackageData>
      <PackageData>
        <PackageID>P12345</PackageID>
        <Occupancy>4</Occupancy>
        <ChargeCurrency>web</ChargeCurrency>
        <Refundable available="1" refundable_until_days="1"
             refundable_until_time="18:00:00"/>
        <ParkingIncluded>1</ParkingIncluded>
        <InternetIncluded>1</InternetIncluded>
      </PackageData>
    </PropertyDataSet>
  
      <!-- Efficient method of defining Room Bundles -->
      <!-- Part 2: Reference RoomData and PackageData through ID -->
    <Result>
      <!-- Note: The default baserate must still show lowest price for double
           occupancy or more. -->
      <!-- Single occupancy pricing will be specified in a room bundle below -->
      <Property>180054</Property>
      <Checkin>2017-10-07</Checkin>
      <Nights>2</Nights>
      <!-- The Baserate, Tax, and OtherFees elements below are optional. If
      provided, these elements much match at least one room bundle pricing
      below -->
      <Baserate currency="USD">199.99</Baserate>
      <Tax currency="USD">25.12</Tax>
      <OtherFees currency="USD">2.00</OtherFees>
      <Occupancy>2</Occupancy>
      <OccupancyDetails>
        <NumAdults>2</NumAdults>
      </OccupancyDetails>
  
      <!-- Base Room Bundle -->
      <RoomBundle>
        <RoomID>060773</RoomID>
        <PackageID>P54321</PackageID>
        <!-- Price for 2 ("occupancy") is repeated and matches baserates and
             attributes provided above -->
        <Baserate currency="USD">199.99</Baserate>
        <Tax currency="USD">25.12</Tax>
        <OtherFees currency="USD">2.00</OtherFees>
        <RatePlanID>060773-P54321</RatePlanID>
      </RoomBundle>
      <RoomBundle>
        <RoomID>060773</RoomID>
        <PackageID>P11111</PackageID>
        <!-- Price for 1 ("occupancy") is the lowest price and will be
             displayed -->
        <Baserate currency="USD">174.99</Baserate>
        <Tax currency="USD">22.08</Tax>
        <OtherFees currency="USD">2.00</OtherFees>
        <RatePlanID>060773-P11111</RatePlanID>
      </RoomBundle>
      <!-- Premium Room Bundle -->
      <RoomBundle>
        <RoomID>436233</RoomID>
        <PackageID>P12345</PackageID>
        <!-- Price for 4 ("occupancy"), any eligible room bundle with 1 or more
             occupancy will be displayed-->
        <Baserate currency="USD">298.88</Baserate>
        <Tax currency="USD">42.12</Tax>
        <OtherFees currency="USD">10.00</OtherFees>
        <RatePlanID>436233-P12345</RatePlanID>
      </RoomBundle>
      <!-- ..Continue providing all available RoomBundle rates under matched
           property for 1 or more occupancies..-->
    </Result>
  </Transaction>`,
};
