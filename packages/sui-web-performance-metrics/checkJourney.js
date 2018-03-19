const { createTimer } = require('./helpers')
const { withHarResponse } = require('./withHarResponse')

const { JOURNEY_ACTIONS } = require('./types')

function handleError ({ page }) {
  return (err) => {
    console.error('!!Error', err)
    page.screenshot()
    return {}
  }
}

async function checkJourney ({client, page, journey}) {
  let timers = []
  let previousStep

  const { steps } = journey
  console.log(`· checkJourney with ${steps.length} steps`)

  const harResponse = await withHarResponse(page, async () => {
    for (const step of steps) {
      let timer = createTimer()
      const [action, payload] = step
      console.log(`·· step: ${action} - ${payload}`)

      if (action === JOURNEY_ACTIONS.TYPE && previousStep) {
        const [, elementWhereTyping] = previousStep
        await page[action](elementWhereTyping, payload)
      } else {
        await page[action](payload)
      }

      const timeUsed = timer.stop()
      console.log(`··· done in ${timeUsed}ms`)

      timers.push(timeUsed)
      previousStep = step
    }
  }).catch(handleError({ page }))

  return { harResponse, timers }
}

module.exports = {
  checkJourney,
}
