const axios = require('axios')

const EMPTY_RESPONSE = {}
const PAGE_SPEED_URL =
  'https://www.googleapis.com/pagespeedonline/v4/runPagespeed'
const STRATEGY_MOBILE = 'mobile'
const STRATEGY_DESKTOP = 'desktop'

/**
 * Handle error of checking page speed
 * @param {Object} err Error stack
 */
function handleError(err) {
  console.error(err)
  return EMPTY_RESPONSE
}

/**
 * Extract the page speed information from Google API if googlePageSpeed is passed
 * @param {Object} params
 * @param {Object} params.page Page of Puppeeteer instance
 * @param {string} params.googlePageSpeedApiKey API KEY for using  Google Page Speed
 * @param {string} params.url The url to extract the information of Page Speed
 * @param {Object} params.viewport Object with all the info of the viewport
 */
async function getGooglePageSpeedResults({
  googlePageSpeedApiKey,
  url,
  viewport
}) {
  const {isMobile} = viewport
  const strategy = isMobile === true ? STRATEGY_MOBILE : STRATEGY_DESKTOP

  if (typeof googlePageSpeedApiKey === 'undefined') {
    return EMPTY_RESPONSE
  }

  const params = {url, strategy}
  const {data} = await axios.get(PAGE_SPEED_URL, {params}).catch(handleError)
  return data
}

module.exports = {
  getGooglePageSpeedResults
}
