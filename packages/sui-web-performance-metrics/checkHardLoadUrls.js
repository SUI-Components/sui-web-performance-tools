const { createTimer } = require('./helpers')
const { withHarResponse } = require('./withHarResponse')

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

async function checkUrl ({ page, url }) {
  const doOnPage = async () => {
    await page.goto(url)
    const performanceMetrics = await getPerformanceMetrics({ page })
    return { performanceMetrics }
  }
  return withHarResponse(page, doOnPage)
}

function handleError (err) {
  console.log(err)
}

async function checkHardLoadUrls ({ page, hardLoadUrls }) {
  console.log('· checkHardLoadUrls')
  let checkResults = []
  for (const url of hardLoadUrls) {
    console.log(`·· checking url ${url}`)
    const timer = createTimer()
    const singleCheckResult = await checkUrl({ page, url }).catch(handleError)
    const timeUsed = timer.stop()
    checkResults.push({ ...singleCheckResult, timeUsed })
  }
  return checkResults
}

module.exports = {
  checkHardLoadUrls
}
