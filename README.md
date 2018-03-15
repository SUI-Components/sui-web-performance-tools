# Web Performance Metrics

Get web performance metrics effortless.

## Config

```javascript
const { getWebPerformanceMetrics, NETWORK_CONDITIONS, JOURNEY_ACTIONS, VIEWPORTS } = require('@s-ui/web-performance-metrics')

const checkSuite = {
  networkCondition: NETWORK_CONDITIONS.GOOD_3G,
  viewport: VIEWPORTS.MOBILE,
  hardLoadUrls: [
    'http://google.es',
    'http://google.com',
    'http://google.co.uk',
  ],
  funnelJourney: {
    steps: [
      [JOURNEY_ACTIONS.GO_TO, 'http://google.es'],
      [JOURNEY_ACTIONS.WAIT_FOR, 'input.gsfi'],
      [JOURNEY_ACTIONS.FOCUS, 'input.gsfi'],
      [JOURNEY_ACTIONS.TYPE, 'Sui Components'],
      [JOURNEY_ACTIONS.CLICK, '.r a'],
      [JOURNEY_ACTIONS.WAIT_FOR, '.org-name']
    ]
  }
}

getWebPerformanceMetrics({ checkSuite })
  .then(results => {
    console.log(results)
  })
```
