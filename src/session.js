class Session {
  static data = {
    guilds: {},
    marryRequests: [],
  }

  static getStorage(msg) {
    return Session.data.guilds[msg.guild.id].storage
  }

  static createRequestId(msg) {
    return '' + msg.guild.id + ':' + msg.author.username
  }
}


module.exports = Session