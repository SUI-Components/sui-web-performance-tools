/**
 * Emulate a specific network condition
 * @param {Object} params
 * @param {Object} params.client Browser client
 * @param {Object} params.networkCondition Network condition cofiguration
 */
async function emulateNetworkConditionOnClient ({ client, networkCondition = {} }) {
  await client.send('Network.enable')
  await client.send('Network.emulateNetworkConditions', { offline: false, ...networkCondition })
}

/**
 * Create a timer with a stop method in order to detect time passed in ms
 */
function createTimer () {
  const startTime = process.hrtime()
  return {
    stop () {
      const diff = process.hrtime(startTime)
      const nanoseconds = (diff[0] * 1e9) + diff[1]
      return Math.round(nanoseconds / 1e6 * 100) / 100
    }
  }
}

module.exports = {
  createTimer,
  emulateNetworkConditionOnClient
}
