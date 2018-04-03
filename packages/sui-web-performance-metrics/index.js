const { emulateNetworkConditionOnClient } = require('./helpers')
const { checkHardLoadUrls } = require('./checkHardLoadUrls')
const { checkJourney } = require('./checkJourney')

const DEFAULT_USER_AGENT = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3325.146 Safari/537.36'

/**
 * Get Web Performance Metrics
 * @param {Object} params
 * @param {Object} params.browser Puppeeter browser object in order to be used for getting metrics. If not prived, one will be created
 * @param {Object} params.checkSuite Testing configuration to be peformed in order to extract metrics
 * @param {string} params.googlePageSpeedApiKey API KEY for using Google Page Speed
 */
async function getWebPerformanceMetrics ({ browser, checkSuite, googlePageSpeedApiKey } = {}) {
  try {
    if (typeof checkSuite === 'undefined') {
      throw new Error('checkSuite parameter is required')
    }

    if (typeof browser === 'undefined') {
      const puppeteer = require('puppeteer')
      browser = await puppeteer.launch()
    }

    const page = await browser.newPage()
    await page.setCacheEnabled(false)
    await page.setUserAgent(DEFAULT_USER_AGENT)
    // extract the info from the check config
    const { extraHeaders, hardLoadUrls, funnelJourney, networkCondition, viewport } = checkSuite
    if (typeof extraHeaders !== 'undefined') {
      await page.setExtraHTTPHeaders(extraHeaders)
    }
    // set the viewport as specified on the check config
    await page.setViewport(viewport)
    // create a CPD session and emulate the network as specified on the check config
    const client = await page.target().createCDPSession()
    await emulateNetworkConditionOnClient({ client, networkCondition })
    // get the result of performing all the checks
    const results = {
      hardLoadUrls: await checkHardLoadUrls({ googlePageSpeedApiKey, page, hardLoadUrls, viewport }),
      funnelJourney: await checkJourney({ client, page, journey: funnelJourney })
    }
    // return the results
    return results
  } catch (e) {
    console.error(e)
    // if we had an error, force to close browser connection
    return Promise.reject(e)
  } finally {
    // close browser connection
    await browser.close()
  }
}

module.exports = {
  getWebPerformanceMetrics,
  types: require('./types')
}
