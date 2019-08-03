const Discord = require('discord.js');
const Session = require('./session.js')

const hooks = {
  infomarry: function (msg) {
    const storage = Session.getStorage(msg)
    const embed = msg.embeds[0]

    const name = embed.author.name
    if (storage.get(name) === null) {
      console.log(`Character '${name}' not found. Registering`)
      const description = embed.description
      const image = `<${embed.image.url}>`
      console.log(image)
      storage.set(name, {
        description,
        image
      })
    }
  },
  mymarry: function(msg) {
    console.log(Session.data.marryRequests)
    const requestId = Session.createRequestId(msg, 'mymarry')
    const requestIndex = Session.data.marryRequests.findIndex(i => i === requestId)
    if (requestIndex < 0) {
      return
    }
    const storage = Session.getStorage(msg)
    const embed = msg.embeds[0]
    const description = embed.description
    const characters = description.substring(2).split('\n')
    characters.forEach(name => {
      const character = storage.get(name)
      let image = null
      let description = null
      if (character != null) {
        image = character.image
        description = character.description
      }
      postImage(msg, name, image, description)
    })
    Session.data.marryRequests.splice(requestIndex, 1)
    console.log(Session.data.marryRequests)

  }
}

function postImage(msg, name, link, description) {
  
  const embed = new Discord.RichEmbed().setTitle(name)

  if (link != null) {
    link = link.replace(/^</, '').replace(/>$/, '')
    embed.setThumbnail(link)
    embed.setDescription(description)
  } else {
    embed.setDescription(`Character not recorded yet, try running command: \`\`\`$infomarry ${name}\`\`\``)
  }

  let content = {
    embed
  }

  msg.channel.send(content).catch(console.error)
}

class Hooks {
  constructor() {
    this.hooks = hooks
    this.hookKeys = Object.keys(this.hooks)
  }

  handle(msg) {
    if (msg.embeds.length === 0) {
      return
    }
    const embed = msg.embeds[0]
    const description = embed.description

    let hookName = null
    if (description.includes('Claims') && description.includes('Likes')) {
      hookName = 'infomarry'
    } else if (embed.author.name.endsWith('\'s harem')) {
      hookName = 'mymarry'
    }

    if (hookName != null && Session.data.guilds[msg.guild.id].hooks[hookName]) {
      hooks[hookName](msg)
    }
  }
}

module.exports = new Hooks()