import { Client } from '../mod.ts'
import { TOKEN } from './config.ts'

const client = new Client({
  token: TOKEN,
  intents: ['GUILDS']
})

client.on('debug', console.log)

await client.connect()
console.log('Connected!')

setTimeout(() => {
  console.log('Destroying...')
  client.destroy()
}, 3000)
