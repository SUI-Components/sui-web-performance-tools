/**
 * Create a timer with a stop method in order to detect time passed in ms
 */
function createTimer() {
  const startTime = process.hrtime()
  return {
    stop() {
      const diff = process.hrtime(startTime)
      const nanoseconds = diff[0] * 1e9 + diff[1]
      return Math.round((nanoseconds / 1e6) * 100) / 100
    }
  }
}

/**
 * Emulate a specific network condition
 * @param {Object} params
 * @param {Object} params.client Browser client
 * @param {Object} params.networkCondition Network condition cofiguration
 */
async function emulateNetworkConditionOnClient({
  client,
  networkCondition = {}
}) {
  await client.send('Network.enable')
  await client.send('Network.emulateNetworkConditions', {
    offline: false,
    ...networkCondition
  })
}

/**
 * Resolve package. If not present, installs package prior return.
 * @param {*} pkg Name of package to install in case of absence. ex: `my-package@8.5`
 * @return {Promise<String>} Resolve when package is installed
 */
const resolveLazyNPMPackage = async (pkg) => {
  const [name,] = pkg.split('@')
  try {
    require(name)
  } catch {
    const {getSpawnPromise} = require('@s-ui/helpers/cli')
    return getSpawnPromise('npm', ['install', `${pkg}`, '--no-save'])
  }
}

module.exports = {
  createTimer,
  emulateNetworkConditionOnClient,
  resolveLazyNPMPackage
}
