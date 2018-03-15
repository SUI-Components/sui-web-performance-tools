const { emulateNetworkConditionOnClient } = require('./helpers')
const { checkHardLoadUrls } = require('./checkHardLoadUrls')
const { checkJourney } = require('./checkJourney')

async function getWebPerformanceMetrics ({ browser, checkSuite } = {}) {
  if (typeof checkSuite === 'undefined') {
    return throw Error('checkSuite parameter is required')
  }

  if (typeof browser === 'undefined') {
    const puppeteer = require('puppeteer')
    browser = await puppeteer.launch()
  }

  const page = await browser.newPage()
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
    funnelJourney: await checkJourney({ client, page, journey: funnelJourney })
  }
  console.log(JSON.stringify(results, null, 2))
  // close browser connection
  await browser.close()
  // return the results
  return results
}

module.exports = {
  getWebPerformanceMetrics,
  types: require('./types')
}
