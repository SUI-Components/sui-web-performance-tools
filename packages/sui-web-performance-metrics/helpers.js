async function emulateNetworkConditionOnClient ({ client, networkCondition = {} }) {
  await client.send('Network.enable')
  await client.send('Network.emulateNetworkConditions', { offline: false, ...networkCondition })
}

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

function getTimeFromPerformanceMetrics (metrics, name) {
  return metrics.metrics.find(x => x.name === name).value * 1000
}

function extractDataFromPerformanceTiming (metrics, ...dataNames) {
  const navigationStart = getTimeFromPerformanceMetrics(
    metrics,
    'NavigationStart'
  )

  const extractedData = {}
  dataNames.forEach(name => {
    extractedData[name] = getTimeFromPerformanceMetrics(metrics, name) - navigationStart
  })

  return extractedData
}

module.exports = {
  createTimer,
  emulateNetworkConditionOnClient,
  getTimeFromPerformanceMetrics,
  extractDataFromPerformanceTiming,
}
