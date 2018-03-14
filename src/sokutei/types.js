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
    latency: 40, // 40ms
    uploadThroughput: 750 * 1024 / 8, // 750kbps
  },
  GOOD_4G: {
    downloadThroughput: 4 * 1024 * 1024 / 8, // 4mbps
    latency: 20, // 20ms
    uploadThroughput: 3 * 1024 * 1024 / 8, // 3mbps
  },
}

const VIEWPORTS = {
  DESKTOP_BIG: {
    width: 1920,
    height: 1080
  },
  DESKTOP: {
    width: 1366,
    height: 768
  },
  MOBILE: {
    hasTouch: true,
    isMobile: true,
    width: 360,
    height: 640
  },
  MOBILE_BIG: {
    hasTouch: true,
    isMobile: true,
    width: 375,
    height: 667
  },
  TABLET: {
    width: 768,
    height: 1024,
    hasTouch: true
  },
}

module.exports = {
  NETWORK_CONDITIONS,
  JOURNEY_ACTIONS,
  VIEWPORTS
}
