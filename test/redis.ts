import * as harmony from '../mod.ts'
import { TOKEN } from './config.ts'

const client = new harmony.Client({
  token: TOKEN,
  intents: ['GUILDS', 'GUILD_MESSAGES'],
  cache: new harmony.RedisCacheAdapter({
    hostname: '127.0.0.1',
    port: 6379
  })
})

client.on('debug', console.log)

await client.connect()
console.log('Connected!!')
