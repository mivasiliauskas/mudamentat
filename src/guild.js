const Storage = require('./storage.js')

class Guild {
  constructor(guildInstance, dataChannelName) {
    this.guildInstance = guildInstance
    this.dataChannelName = dataChannelName
    this.storage = new Storage()
    this.hooks = {
      mymarry: true,
      infomarry: true
    }
  }

  init() {
    let channel = this.guildInstance.channels.find(c => c.name === this.dataChannelName)
    if (channel === null) {
      console.log('Channel not found, creating new')
      channel = this.guildInstance.createChannel(this.dataChannelName).then(() => {
        this.init()
      })
      return
    }

    this.storage.init(channel).then(() => {
      Object.keys(this.hooks).forEach(k => {
        const storedValue = this.storage.data['mudamentathook' + k] || null
        if (storedValue != null) {
          this.hooks[k] = storedValue
        }
        console.log(`Hook '${k}' value ${storedValue}`)
      })
    })

  }
}

module.exports = Guild