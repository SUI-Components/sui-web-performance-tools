const { withHarResponse } = require('./withHarResponse')

async function checkUrl ({ page, url }) {
  const doOnPage = async () => { await page.goto(url) }
  return withHarResponse(page, doOnPage)
}

async function checkHardLoadUrls ({ page, hardLoadUrls }) {
  let checkResults = []
  for (const url of hardLoadUrls) {
    const singleCheckResult = await checkUrl({ page, url })
    checkResults.push(singleCheckResult)
  }
  return checkResults
}

module.exports = {
  checkHardLoadUrls
}
