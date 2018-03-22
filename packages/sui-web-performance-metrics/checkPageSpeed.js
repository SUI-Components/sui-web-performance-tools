const axios = require('axios')

const EMPTY_RESPONSE = {}
const PAGE_SPEED_URL = 'https://www.googleapis.com/pagespeedonline/v4/runPagespeed'
const STRATEGY_MOBILE = 'mobile'
const STRATEGY_DESKTOP = 'desktop'

function handleError (err) {
  console.error(err)
  return EMPTY_RESPONSE
}

async function checkPageSpeed ({ googlePageSpeedApiKey, url, viewport }) {
  const { isMobile } = viewport
  const strategy = isMobile === true ? STRATEGY_MOBILE : STRATEGY_DESKTOP

  if (typeof googlePageSpeedApiKey === 'undefined') {
    return EMPTY_RESPONSE
  }

  const params = { url, strategy }
  const { data } = await axios.get(PAGE_SPEED_URL, { params }).catch(handleError)
  return data
}

module.exports = {
  checkPageSpeed,
}
