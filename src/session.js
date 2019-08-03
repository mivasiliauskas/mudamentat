class Session {
  static data = {
    guilds: {},
    marryRequests: [],
  }

  static getStorage(msg) {
    return Session.data.guilds[msg.guild.id].storage
  }

  static createRequestId(msg,command) {
    return '' + msg.guild.id + ':' + command
  }
}


module.exports = Session