import { Client } from '../models/client.ts'
import { GatewayIntents } from '../types/gatewayTypes.ts'
import { TOKEN } from './config.ts'
import { Channel } from '../structures/channel.ts'
import { GuildTextChannel } from '../structures/guildTextChannel.ts'
import { TextChannel } from '../structures/textChannel.ts'
import { Guild } from '../structures/guild.ts'
import { User } from '../structures/user.ts'

const bot = new Client()

bot.on('ready', () => {
  console.log('READY!')
})

bot.on('channelDelete', (channel: Channel) => {
  console.log('channelDelete', channel.id)
})

bot.on('channelUpdate', (before: Channel, after: Channel) => {
  if (before instanceof GuildTextChannel && after instanceof GuildTextChannel) {
    console.log('channelUpdate', before.name)
    console.log('channelUpdate', after.name)
  } else {
    console.log('channelUpdate', before.id)
    console.log('channelUpdate', after.id)
  }
})

bot.on('channelCreate', (channel: Channel) => {
  console.log('channelCreate', channel.id)
})

bot.on('channelPinsUpdate', (before: TextChannel, after: TextChannel) => {
  console.log(
    'channelPinsUpdate',
    before.lastPinTimestamp,
    after.lastPinTimestamp
  )
})

bot.on('guildBanAdd', (guild: Guild, user: User) => {
  console.log('guildBanAdd', guild.id, user.id)
})

bot.on('guildBanRemove', (guild: Guild, user: User) => {
  console.log('guildBanRemove', guild.id, user.id)
})

bot.on('guildCreate', (guild: Guild) => {
  console.log('guildCreate', guild.id)
})

bot.on('guildDelete', (guild: Guild) => {
  console.log('guildDelete', guild.id)
})

bot.on('guildUpdate', (before: Guild, after: Guild) => {
  console.log('guildUpdate', before.name, after.name)
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
