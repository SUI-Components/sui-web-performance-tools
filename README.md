## sui-web-performance-metrics

Library for extracing performance metrics.

This library exports a set of types in order to be used for creating the object you need pass to the method with the checks you want to perform.

### How to use

```js
const { getWebPerformanceMetrics, types } = require('@s-ui/web-performance-metrics')
const { NETWORK_CONDITIONS, JOURNEY_ACTIONS, VIEWPORTS } = types

const checkSuite = {
  customHeaders: '',
  networkCondition: NETWORK_CONDITIONS.GOOD_3G,
  viewport: VIEWPORTS.MOBILE,
  hardLoadUrls: [
    'https://google.es',
    'https://google.com',
    'https://google.co.uk'
  ],
  funnelJourney: {
    steps: [
      [JOURNEY_ACTIONS.GO_TO, 'https://www.google.com'],
      [JOURNEY_ACTIONS.WAIT_FOR, '#lst-ib'],
      [JOURNEY_ACTIONS.FOCUS, '#lst-ib'],
      [JOURNEY_ACTIONS.TYPE, 'Barcelona'],
      [JOURNEY_ACTIONS.CLICK, '.jsb input:first-child'],
      [JOURNEY_ACTIONS.WAIT_FOR, '#rso'],
      [JOURNEY_ACTIONS.CLICK, 'a[ping]']
    ]
  }
}

const { hardLoadUrls, funnelJourney: funnelJourneyResults } = await getWebPerformanceMetrics({
  checkSuite,
  googlePageSpeedApiKey: GOOGLE_PAGESPEED_API_KEY
}).catch(handleError)
```

### Parameters

checkSuite `{Object}` An object with all the information of the check that you want to perform.
  customHeaders `{string}` Custom header to be used when navigating the page.
  networkCondition `{Object}` Object with all the info of the network condition to be used while navigating.
  viewport `{Object}` Object with all the info about the viewport of the browser to be used while navigating.
  hardLoadUrls `{Array}` Urls to check using hardload strategy.
  funnelJourney `{Object}`
    steps `{Array} An list of steps to perform while navigating the page.

### Response

The method returns a Promise that, when resolved returns an object with two keys `hardLoadUrls` and `funnelJourney`. Each one has all the results and metrics of each test.

