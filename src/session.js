const Storage = require('./storage.js')

class Session {
  static data = {
    guilds: {},
    requests: {},
  }

  static _storage = null

  static get storage() {
    return new Promise(async (resolve, reject) => {
      if (this._storage == null) {
        this._storage = new Storage()
        await this._storage.init()
      }
      resolve(this._storage)
    })
  }

  static createRequestId(msg,command) {
    return '' + msg.guild.id + ':' + command
  }
}


module.exports = Session