import { Client } from '../models/client.ts'
import { GatewayIntents } from '../types/gateway.ts'
import { TOKEN } from './config.ts'
import { Message } from "../structures/message.ts"
import { RedisCacheAdapter } from "../models/CacheAdapter.ts"
import { ClientPresence } from "../structures/presence.ts"

const bot = new Client({
  presence: new ClientPresence({
    activity: {
      name: "Testing",
      type: 'COMPETING'
    }
  }),
  forceNewSession: true
})

bot.setAdapter(new RedisCacheAdapter(bot, {
  hostname: "127.0.0.1",
  port: 6379
}))

bot.on('ready', () => {
  console.log(`[Login] Logged in as ${bot.user?.tag}!`)
  bot.setPresence({
    name: "Test After Ready",
    type: 'COMPETING'
  })
})

bot.on('debug', console.log)

bot.on('messageCreate', async (msg: Message) => {
  if (msg.author.bot) return
  console.log(`${msg.author.tag} (${msg.channel + ""}): ${msg.content}`)
  if (msg.content == "!ping") {
    msg.reply("Pong! API Ping: " + bot.ping + "ms")
  } else if (msg.content == "!members") {
    let col = await msg.guild?.members.collection()
    let data = col?.array().map((c, i) => {
      return `${i + 1}. ${c.user.tag}`
    }).join("\n")
    msg.channel.send("Member List:\n" + data)
  } else if (msg.content == "!guilds") {
    let guilds = await msg.client.guilds.collection()
    msg.channel.send("Guild List:\n" + guilds.array().map((c, i) => {
      return `${i + 1}. ${c.name} - ${c.memberCount} members`
    }).join("\n"))
  } else if (msg.content == "!roles") {
    let col = await msg.guild?.roles.collection()
    let data = col?.array().map((c, i) => {
      return `${i + 1}. ${c.name}`
    }).join("\n")
    msg.channel.send("Roles List:\n" + data)
  } else if (msg.content == "!channels") {
    let col = await msg.guild?.channels.array()
    let data = col?.map((c, i) => {
      return `${i + 1}. ${c.name}`
    }).join("\n")
    msg.channel.send("Channels List:\n" + data)
  }
})

bot.connect(TOKEN, [
  GatewayIntents.GUILD_MEMBERS,
  GatewayIntents.GUILD_PRESENCES,
  GatewayIntents.GUILD_MESSAGES,
  GatewayIntents.DIRECT_MESSAGES,
  GatewayIntents.DIRECT_MESSAGE_REACTIONS,
  GatewayIntents.DIRECT_MESSAGE_TYPING,
  GatewayIntents.GUILDS,
  GatewayIntents.GUILD_BANS,
  GatewayIntents.GUILD_EMOJIS,
  GatewayIntents.GUILD_INTEGRATIONS,
  GatewayIntents.GUILD_INVITES,
  GatewayIntents.GUILD_MESSAGE_REACTIONS,
  GatewayIntents.GUILD_MESSAGE_TYPING,
  GatewayIntents.GUILD_VOICE_STATES,
  GatewayIntents.GUILD_WEBHOOKS
])
