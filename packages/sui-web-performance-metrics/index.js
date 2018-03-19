const { emulateNetworkConditionOnClient } = require('./helpers')
const { checkHardLoadUrls } = require('./checkHardLoadUrls')
const { checkJourney } = require('./checkJourney')

const DEFAULT_USER_AGENT = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3325.146 Safari/537.36'

function handleError ({ page }) {
  return (err) => {
    console.error('!!Error', err)
    page.screenshot()
  }
}

async function getWebPerformanceMetrics ({ browser, checkSuite } = {}) {
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
  const { hardLoadUrls, funnelJourney, networkCondition, viewport } = checkSuite
  // set the viewport as specified on the check config
  await page.setViewport(viewport)
  // create a CPD session and emulate the network as specified on the check config
  const client = await page.target().createCDPSession()
  await emulateNetworkConditionOnClient({ client, networkCondition })
  // get the result of performing all the checks
  const results = {
    hardLoadUrls: await checkHardLoadUrls({ page, hardLoadUrls }),
    funnelJourney: await checkJourney({ client, page, journey: funnelJourney }).catch(handleError({ page }))
  }
  // close browser connection
  await browser.close()
  // return the results
  return results
}

module.exports = {
  getWebPerformanceMetrics,
  types: require('./types')
}
