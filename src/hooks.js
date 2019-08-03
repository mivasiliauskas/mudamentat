const Discord = require('discord.js');
const Session = require('./session.js')

const hooks = {
  character: function (msg) {
    Session.storage.then(async storage => {
      const embed = msg.embeds[0]

      const name = embed.author.name
      if (await storage.get(name) === null) {
        console.log(`Character '${name}' not found. Registering`)
        const description = embed.description.replace(/\n/g, ' ').replace(/ <:\w*:.*/, '')
        console.log(description)
        const image = `<${embed.image.url}>`
        await storage.set(name, {
          description,
          image,
          name
        })
        msg.react('📌')
      }
    })
  },
  mymarry: function(msg) {
    Session.storage.then(async storage => {

      const embed = msg.embeds[0]
      const description = embed.description
      const characters = description.substring(2).split('\n')
      characters.forEach(async name => {
        const character = await storage.get(name)
        let image = null
        let description = null
        if (character != null) {
          image = character.image
          description = character.description
        }
        postImage(msg, name, image, description)
      })
    })
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

    const requestId = msg.guild.id
    if (!Session.data.requests[requestId]) {
      return
    }
    // let hookName = null
    // if (description.includes('Claims') && description.includes('Likes')) {
    //   hookName = 'character'
    // } else if (embed.author.name.endsWith('\'s harem')) {
    //   hookName = 'mymarry'
    // }
    const hookName = Session.data.requests[requestId]

    if (hookName != null) {
      hooks[hookName](msg)
    }
    delete Session.data.requests[requestId]
  }
}

module.exports = new Hooks()