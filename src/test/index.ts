import { Client } from '../models/client.ts'
import { Guild } from '../structures/guild.ts'
import { GatewayIntents } from '../types/gatewayTypes.ts'
import { TOKEN } from './config.ts'
import * as cache from '../models/cache.ts'
import { Member } from "../structures/member.ts"
import { User } from "../structures/user.ts"
import endpoint from "../types/endpoint.ts"
import { Base } from "../structures/base.ts"
import { GuildChannel } from "../structures/guildChannel.ts"

const bot = new Client()

bot.connect(TOKEN, [GatewayIntents.GUILD_MEMBERS, GatewayIntents.GUILD_PRESENCES, GatewayIntents.GUILD_MESSAGES])


const member = <Member> await Member.autoInit(bot, {
  cacheName: 'member',
  endpoint: 'GUILD_MEMBER',
  restURLfuncArgs: ['', '']
})
console.log('getted (cached) ' + member.id)
setInterval(async () => {
  //refreshed check
  console.log('refreshed check: ' + member.id)
  //cached
  console.log('cache: '+(<Member> cache.get('member', '')).id)
}, 10000)

setInterval(async() => {
  member.refresh(bot, {
    cacheName: 'member',
    endpoint: 'GUILD_MEMBER',
    restURLfuncArgs: ['', '']
  })
  //refreshed
  console.log('refreshed: ' + member.id)
}, 20000)