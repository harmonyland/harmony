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
<<<<<<< HEAD
  restURLfuncArgs: ['', '']
=======
  restURLfuncArgs: ['668753256419426314', '333432936390983680']
>>>>>>> 1bf512bcedb9c129c2ec8e35e50d18ff5177b8cb
})
console.log('getted (cached) ' + member.id)
setInterval(async () => {
  //refreshed check
  console.log('refreshed check: ' + member.id)
  //cached
<<<<<<< HEAD
  console.log('cache: '+(<Member> cache.get('member', '')).id)
=======
  console.log('cache: '+(<Member> cache.get('member', '668753256419426314:333432936390983680')).id)
>>>>>>> 1bf512bcedb9c129c2ec8e35e50d18ff5177b8cb
}, 10000)

setInterval(async() => {
  member.refresh(bot, {
    cacheName: 'member',
    endpoint: 'GUILD_MEMBER',
<<<<<<< HEAD
    restURLfuncArgs: ['', '']
=======
    restURLfuncArgs: ['668753256419426314', '333432936390983680']
>>>>>>> 1bf512bcedb9c129c2ec8e35e50d18ff5177b8cb
  })
  //refreshed
  console.log('refreshed: ' + member.id)
}, 20000)