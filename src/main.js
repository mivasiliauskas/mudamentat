require('dotenv').config()

const Discord = require('discord.js');
const client = new Discord.Client();

const COMMAND_PREFIX = '$'
const MASTER_NAME = 'Mudae'
const MAID_NAME = 'Mudamaid'
const DATA_CHANNEL_NAME = 'mudaementat-data'

const commands = require('./commands.js')
const hooks = require('./hooks.js')
const Guild = require('./guild.js')
const Session = require('./session.js')

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
  if (client.user.tag.includes('Test')) {
  }
  
  client.guilds.forEach(g => {
    const guild = new Guild(g, DATA_CHANNEL_NAME)
    guild.init()

    Session.data.guilds[g.id] = guild
  })
});

client.on('message', msg => {
  const content = msg.content
  if (content.startsWith(COMMAND_PREFIX)) {
    let cmdSeparatorIndex = content.search(/\s/)
    if (cmdSeparatorIndex < 0) {
      cmdSeparatorIndex = undefined
    }

    const cmd = content.substring(1, cmdSeparatorIndex)
    const args = content.substr(cmdSeparatorIndex + 1)
    commands.handle(msg, cmd, args)
  } else if (msg.author.username == MASTER_NAME || msg.author.username.startsWith(MAID_NAME)) {
    hooks.handle(msg)
  }
});

client.login(process.env.BOT_TOKEN)
