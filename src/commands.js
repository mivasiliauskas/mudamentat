const Session = require('./session.js')

const commands = {
  mentattoggle : function (msg, argLine) {
    const hookName = argLine
    const hooks = Session.data.guilds[msg.guild.id].hooks
    const storage = Session.getStorage(msg)

    if (Object.keys(hooks).includes(hookName)) {
      hooks[hookName] = !hooks[hookName]
      storage.set('mudamentathook' + hookName, hooks[hookName])
      msg.channel.send(`Hook '${hookName}' ${hooks[hookName] ? 'enabled' : 'disabled'}`).catch(console.error)
    } else {
      msg.channel.send(`Hook '${hookName}' not found`).catch(console.error)
    }
  },
  mymarry_ : function (msg) {
    Session.data.requests[msg.guild.id] = 'mymarry'
  },
  infomarry: function (msg) {
    Session.data.requests[msg.guild.id] = 'character'
  },
  waifu: function (msg) {
    Session.data.requests[msg.guild.id] = 'character'
  },
  mudamentatdata: async function(msg) {
    console.log((await Session.storage).data)
  }
}

class Commands {
  constructor() {
    this.commands = commands
    this.commandKeys = Object.keys(this.commands)
  }

  handle(msg, cmd, argLine){
    if (!this.commandKeys.includes(cmd)) {
      // suppress - probably command for another bot
      return
    }
    argLine = argLine.trim()
    this.commands[cmd](msg, argLine)
  }
}

module.exports = new Commands()
