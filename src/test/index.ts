import { Client } from '../models/client.ts'
import { GatewayIntents } from '../types/gatewayTypes.ts'
import { TOKEN } from './config.ts'
import * as cache from '../models/cache.ts'
import { Member } from '../structures/member.ts'
import { Channel } from '../structures/channel.ts'
import { GuildTextChannel } from '../structures/guildTextChannel.ts'

const bot = new Client()

bot.on('ready', () => {
  console.log('READY!')
})

bot.on('channelUpdate', (before: Channel, after: Channel) => {
  if (before instanceof GuildTextChannel && after instanceof GuildTextChannel) {
    console.log(before.name)
    console.log(after.name)
  }
})

bot.connect(TOKEN, [
  GatewayIntents.GUILD_MEMBERS,
  GatewayIntents.GUILD_PRESENCES,
  GatewayIntents.GUILD_MESSAGES
])
