const {PuppeteerHar} = require('./puppeteerHar')
const pagexray = require('pagexray')

async function withHarResponse(page, doActionsOnPage) {
  const harReader = new PuppeteerHar(page)
  await harReader.start()

  const dataToAggregate = await doActionsOnPage()
  const rawHar = await harReader.stop()

  const harResults = pagexray.convert(rawHar)[0]
  return {...harResults, ...dataToAggregate}
}

module.exports = {
  withHarResponse
}
