class Storage {
  constructor() {
    this.data = {}
    this.dataMessage = null
  }

  init(dataChannel) {
    this.dataChannel = dataChannel

    return dataChannel.fetchMessages({limit: 1}).then((messages) =>
    {
      const message = messages.first()
      if (message == null) {
        console.log('No data found. Initializing')
        this.storeData().then(m => {
          this.dataMessage = m
        })
      } else {
        this.data = JSON.parse(message.content)
        this.dataMessage = message
      }
    })
  }
  
  get(key) {
    return this.data[key] || null
  }

  set(key, value) {
    this.data[key] = value
    this.storeData()
  }

  storeData() {
    const content = JSON.stringify(this.data)
    if (this.dataMessage == null) {
      return this.dataChannel.send(content).catch(console.error)
    } else {
      return this.dataMessage.edit(content).catch(console.error)
    }
  }
}

module.exports = Storage