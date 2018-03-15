const JOURNEY_ACTIONS = {
  GO_TO: 'goto',
  WAIT_FOR: 'waitFor',
  FOCUS: 'focus',
  CLICK: 'click',
  TYPE: 'type'
}

const NETWORK_CONDITIONS = {
  GOOD_3G: {
    downloadThroughput: 1.5 * 1024 * 1024 / 8, // 1.5mbps
    ref: 'good_3g',
    latency: 40, // 40ms
    uploadThroughput: 750 * 1024 / 8, // 750kbps
  },
  GOOD_4G: {
    downloadThroughput: 4 * 1024 * 1024 / 8, // 4mbps
    ref: 'good_4g',
    latency: 20, // 20ms
    uploadThroughput: 3 * 1024 * 1024 / 8, // 3mbps
  },
}

const VIEWPORTS = {
  DESKTOP_BIG: {
    ref: 'desktop_big',
    height: 1080,
    width: 1920,
  },
  DESKTOP: {
    ref: 'desktop',
    height: 768,
    width: 1366,
  },
  MOBILE: {
    hasTouch: true,
    ref: 'mobile',
    isMobile: true,
    width: 360,
    height: 640
  },
  MOBILE_BIG: {
    hasTouch: true,
    ref: 'mobile_big',
    isMobile: true,
    width: 375,
    height: 667
  },
  TABLET: {
    hasTouch: true,
    height: 1024,
    ref: 'tablet',
    width: 768,
  },
}

module.exports = {
  NETWORK_CONDITIONS,
  JOURNEY_ACTIONS,
  VIEWPORTS
}
