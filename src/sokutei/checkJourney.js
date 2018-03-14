const { createTimer } = require('./helpers')
const { withHarResponse } = require('./withHarResponse')

const { JOURNEY_ACTIONS } = require('./types')

async function checkJourney ({client, page, journey}) {
  let timers = []
  let previousStep

  const { steps } = journey

  const harResponse = await withHarResponse(page, async () => {
    for (const step of steps) {
      let timer = createTimer()
      const [action, payload] = step

      if (action === JOURNEY_ACTIONS.TYPE && previousStep) {
        const [, elementWhereTyping] = previousStep
        await page[action](elementWhereTyping, payload)
      } else {
        await page[action](payload)
      }

      const timeUsed = timer.stop()
      console.log(`Done step ${action} - ${payload} in ${timeUsed.milliseconds}ms`)
      timers.push(timeUsed)
      previousStep = step
    }
  })

  return { harResponse, timers }
}

module.exports = {
  checkJourney,
}
