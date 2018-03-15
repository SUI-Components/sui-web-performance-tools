const PuppeteerHar = require('puppeteer-har')
const pagexray = require('pagexray')

async function withHarResponse (page, doActionsOnPage) {
  const harReader = new PuppeteerHar(page)
  await harReader.start()

  await doActionsOnPage()

  const rawHar = await harReader.stop()
  return pagexray.convert(rawHar)[0]
}

module.exports = {
  withHarResponse
}
