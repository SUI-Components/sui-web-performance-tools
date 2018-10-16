const {harFromMessages} = require('chrome-har')

// event types to observe
const observe = [
  'Page.loadEventFired',
  'Page.domContentEventFired',
  'Page.frameStartedLoading',
  'Page.frameAttached',
  'Network.requestWillBeSent',
  'Network.requestServedFromCache',
  'Network.dataReceived',
  'Network.responseReceived',
  'Network.resourceChangedPriority',
  'Network.loadingFinished',
  'Network.loadingFailed'
]

class PuppeteerHar {
  /**
   * @param {object} page
   */
  constructor(page) {
    this.page = page
    this.mainFrame = this.page.mainFrame()
    this.events = []
  }

  /**
   * @return {Promise<void>}
   */
  async start() {
    this.client = await this.page.target().createCDPSession()
    await this.client.send('Page.enable')
    await this.client.send('Network.enable')
    observe.forEach(async method => {
      await this.client.on(method, params => {
        this.events.push({method, params})
      })
    })
  }

  /**
   * @returns {Promise<void|object>}
   */
  async stop() {
    await this.client.detach()
    const har = harFromMessages(this.events)
    return har
  }
}

module.exports = {PuppeteerHar}
