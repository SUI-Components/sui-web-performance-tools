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
  return new Error(err)
}

async function checkJourney ({client, page, journey = {}}) {
  let timers = []
  let previousStep

  const { steps = [] } = journey
  if (steps.length === 0) {
    console.warn('No steps for the user journey defined')
    return { harResponse: {}, timers: [] }
  }

  console.log(`· checkJourney with ${steps.length} steps`)

  const harResponse = await withHarResponse(page, async () => {
    for (const step of steps) {
      const [action, payload] = step
      const timer = createTimer()
      let result

      console.log(`·· step: ${action} - ${payload}`)

      if (action === JOURNEY_ACTIONS.TYPE && previousStep) {
        const [, elementWhereTyping] = previousStep
        result = await page[action](elementWhereTyping, payload).catch(handleErrorAction)
      } else {
        result = await page[action](payload).catch(handleErrorAction)
      }

      if (result instanceof Error) {
        throw new Error(`Action had an error. Don't use this journey.`)
      }

      const timeUsed = timer.stop()
      timers.push(timeUsed)
      // save previous step in case we need later if the action is typing
      previousStep = step

      console.log(`··· done in ${timeUsed}ms`)
    }
  }).catch(handleErrorWithHarResponse)

  return { harResponse, timers }
}

module.exports = {
  checkJourney,
}
