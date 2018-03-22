const speedline = require('speedline')
const { createTimer } = require('./helpers')
const { withHarResponse } = require('./withHarResponse')
const { getGooglePageSpeedResults } = require('./getGooglePageSpeedResults')

const TRACE_FILE_PATH = '/tmp/trace.json'

/**
 * Get speedIndex from traceFile
 * @param {Object} params
 * @param {Object} params.page Page of Puppeeteer instance
 */
async function getSpeedIndexFromTraceFile () {
  return speedline(TRACE_FILE_PATH, {
    include: 'speedIndex'
  }).catch(handleSpeedLineError)
}

/**
 * Get native performance metrics from the browser
 * @param {Object} params
 * @param {Object} params.page Page of Puppeeteer instance
 */
async function getPerformanceMetrics ({ page }) {
  return page.evaluate(_ => {
    let paint = {}

    window.performance.getEntriesByType('paint').forEach(entry => {
      paint[entry.name] = entry.startTime
    })

    const resources = window.performance.getEntriesByType('resource')
      .map(({ duration, name }) => ({ duration, name }))

    return { paint, resources }
  })
}

/**
 * Check a single url for getting the har response
 * @param {Object} params
 * @param {Object} params.page Page of Puppeeteer instance
 * @param {string} params.url Url to check
 */
async function checkUrl ({ page, url }) {
  const doOnPage = async () => {
    await page.goto(url).catch(_ => ({}))
    const performanceMetrics = await getPerformanceMetrics({ page })
    return { performanceMetrics }
  }
  return withHarResponse(page, doOnPage)
}

/**
 * Handle error of checking url
 * @param {Object} err Error stack
 */
function handleErrorCheckingUrl (err) {
  console.error(err)
  return {}
}

/**
 * Handle error of creating speed line from tracing
 * @param {Object} err Error stack
 */
function handleSpeedLineError (err) {
  console.error(err)
  return { speedIndex: undefined }
}

/**
 * Check a single url for getting the har response
 * @param {Object} params
 * @param {string} params.googlePageSpeedApiKey API Key for using GooglePageSpeed
 * @param {Array<string>} params.hardLoadUrls Array of strings
 * @param {Object} params.viewport Viewport object with all the information to emulate it
 */
async function checkHardLoadUrls ({ googlePageSpeedApiKey, page, hardLoadUrls, viewport }) {
  console.log('· checkHardLoadUrls')

  let checkResults = []
  for (const url of hardLoadUrls) {
    console.log(`·· checking url ${url}`)

    const timer = createTimer()
    await page.tracing.start({path: TRACE_FILE_PATH, screenshots: true})
    const singleCheckResult = await checkUrl({ page, url }).catch(handleErrorCheckingUrl)

    await page.tracing.stop()
    const timeUsed = timer.stop()

    const { speedIndex } = await getSpeedIndexFromTraceFile()
    const pageSpeedResult = await getGooglePageSpeedResults({ googlePageSpeedApiKey, url, viewport })
    checkResults.push({ ...singleCheckResult, timeUsed, pageSpeedResult, speedIndex })
  }

  return checkResults
}

module.exports = {
  checkHardLoadUrls
}
