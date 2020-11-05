import { Client } from '../models/client.ts'
import { GatewayIntents } from '../types/gateway.ts'
import { TOKEN } from './config.ts'
import { Message } from "../structures/message.ts"
import { DefaultCacheAdapter } from "../models/cacheAdapter.ts"
import { ClientPresence } from "../structures/presence.ts"
import { Member } from "../structures/member.ts"
import { Role } from "../structures/role.ts"
import { GuildChannel } from "../managers/guildChannels.ts"
import { TextChannel } from "../structures/textChannel.ts"
import { Embed } from "../structures/embed.ts"
import { Guild } from "../structures/guild.ts"

const bot = new Client({
  presence: new ClientPresence({
    activity: {
      name: "Testing",
      type: 'COMPETING'
    }
  }),
})

bot.setAdapter(new DefaultCacheAdapter(bot))

bot.on('ready', () => {
  console.log(`[Login] Logged in as ${bot.user?.tag}!`)
  bot.setPresence({
    name: "Test - Ready",
    type: 'COMPETING'
  })
})

bot.on('debug', console.log)

bot.on('channelPinsUpdate', (before: TextChannel, after: TextChannel) => {
  console.log(before.send('', {
    embed: new Embed({
      title: 'Test',
      description: 'Test Embed'
    })
  }))
})

bot.on('messageCreate', async (msg: Message) => {
  if (msg.author.bot === true) return
  if (msg.content === "!ping") {
    msg.reply(`Pong! Ping: ${bot.ping}ms`)
  } else if (msg.content === "!members") {
    const col = await msg.guild?.members.collection()
    const data = col?.array().map((c: Member, i: number) => {
      return `${i + 1}. ${c.user.tag}`
    }).join("\n") as string
    msg.channel.send("Member List:\n" + data)
  } else if (msg.content === "!guilds") {
    const guilds = await msg.client.guilds.collection()
    msg.channel.send("Guild List:\n" + (guilds.array().map((c: Guild, i: number) => {
      return `${i + 1}. ${c.name} - ${c.memberCount} members`
    }).join("\n") as string))
  } else if (msg.content === "!roles") {
    const col = await msg.guild?.roles.collection()
    const data = col?.array().map((c: Role, i: number) => {
      return `${i + 1}. ${c.name}`
    }).join("\n") as string
    msg.channel.send("Roles List:\n" + data)
  } else if (msg.content === "!channels") {
    const col = await msg.guild?.channels.array()
    const data = col?.map((c: GuildChannel, i: number) => {
      return `${i + 1}. ${c.name}`
    }).join("\n") as string
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
