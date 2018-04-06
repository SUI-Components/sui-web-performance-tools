const {PuppeteerHar} = require('./puppeteerHar')
const pagexray = require('pagexray')

async function withHarResponse (page, doActionsOnPage) {
  const harReader = new PuppeteerHar(page)
  await harReader.start()

  const dataToAggregate = await doActionsOnPage()
  console.log(dataToAggregate)
  const rawHar = await harReader.stop()
  console.log(JSON.stringify(rawHar, null, 2))

  const harResults = pagexray.convert(rawHar)[0]
  return { ...harResults, ...dataToAggregate }
}

module.exports = {
  withHarResponse
}
