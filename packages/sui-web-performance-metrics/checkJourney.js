const { createTimer } = require('./helpers')
const { withHarResponse } = require('./withHarResponse')

const { JOURNEY_ACTIONS } = require('./types')

/**
 * Handle error of creating speed line from tracing
 * @param {Error} err
 */
function handleErrorWithHarResponse (err) {
  console.error(err)
  return {}
}

/**
 * Handle error of making an action
 * @param {Error} err
 */
function handleErrorAction (err) {
  console.error(err)
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
        await page[action](elementWhereTyping, payload).catch(handleErrorAction)
      } else {
        await page[action](payload).catch(handleErrorAction)
      }

      const timeUsed = timer.stop()
      console.log(`··· done in ${timeUsed}ms`)

      timers.push(timeUsed)
      previousStep = step
    }
  }).catch(handleErrorWithHarResponse)

  return { harResponse, timers }
}

module.exports = {
  checkJourney,
}
