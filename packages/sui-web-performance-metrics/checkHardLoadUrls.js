const speedline = require('speedline-core')
const {createTimer} = require('./helpers')
const {withHarResponse} = require('./withHarResponse')
const {getGooglePageSpeedResults} = require('./getGooglePageSpeedResults')

/**
 * Create an unique trace file path for one check
 */
function createUniqueTraceFilePath() {
  return `/tmp/trace${process.pid}_${Date.now()}.json`
}

/**
 * Get speedIndex from traceFile
 * @param {Object} params
 * @param {Object} params.page Page of Puppeeteer instance
 */
async function getSpeedIndexFromTraceFile({traceFilePath}) {
  return speedline(traceFilePath, {
    include: 'speedIndex'
  }).catch(handleSpeedLineError)
}

/**
 * Get native performance metrics from the browser
 * @param {Object} params
 * @param {Object} params.page Page of Puppeeteer instance
 */
async function getPerformanceMetrics({page}) {
  return page.evaluate(_ => {
    let paint = {}

    window.performance.getEntriesByType('paint').forEach(entry => {
      paint[entry.name] = entry.startTime
    })

    const resources = window.performance
      .getEntriesByType('resource')
      .map(({duration, name}) => ({duration, name}))

    return {paint, resources}
  })
}

/**
 * Check a single url for getting the har response
 * @param {Object} params
 * @param {Object} params.page Page of Puppeeteer instance
 * @param {string} params.url Url to check
 */
async function checkUrl({page, url}) {
  const doOnPage = async () => {
    await page.goto(url).catch(_ => ({}))
    const performanceMetrics = await getPerformanceMetrics({page})
    return {performanceMetrics}
  }
  return withHarResponse(page, doOnPage)
}

/**
 * Handle error of checking url
 * @param {Object} err Error stack
 */
function handleErrorCheckingUrl(err) {
  console.error(err)
  return {}
}

/**
 * Handle error of creating speed line from tracing
 * @param {Object} err Error stack
 */
function handleSpeedLineError(err) {
  console.error(err)
  return {speedIndex: undefined}
}

/**
 * Check list of urls for getting the har response
 * @param {Object} params
 * @param {string} params.googlePageSpeedApiKey API Key for using GooglePageSpeed
 * @param {Array<string>} params.hardLoadUrls Array of strings
 * @param {Object} params.viewport Viewport object with all the information to emulate it
 */
async function checkHardLoadUrls({
  googlePageSpeedApiKey,
  page,
  hardLoadUrls,
  viewport
}) {
  console.log('· checkHardLoadUrls')

  let checkResults = []
  for (const hardLoadUrl of hardLoadUrls) {
    // we're supporting hardLoadUrls to be strings or object with name/url
    let {name = false, url} = hardLoadUrl
    url = url || hardLoadUrl

    console.log(`·· checking ${[name, url].filter(Boolean).join(' - ')}`)
    const traceFilePath = createUniqueTraceFilePath()
    const timer = createTimer()
    await page.tracing.start({path: traceFilePath, screenshots: true})
    console.log(`··· writing traceFilePath in ${traceFilePath}`)

    const singleCheckResult = await checkUrl({page, url}).catch(
      handleErrorCheckingUrl
    )

    await page.tracing.stop()
    const timeUsed = timer.stop()

    const {speedIndex} = await getSpeedIndexFromTraceFile({traceFilePath})
    const pageSpeedResult = await getGooglePageSpeedResults({
      googlePageSpeedApiKey,
      url,
      viewport
    })
    checkResults.push({
      ...singleCheckResult,
      name,
      url,
      timeUsed,
      pageSpeedResult,
      speedIndex
    })
  }

  return checkResults
}

module.exports = {
  checkHardLoadUrls
}
