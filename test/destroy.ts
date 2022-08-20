import { Client } from '../mod.ts'

const client = new Client({
  token: Deno.env.get('TOKEN'),
  intents: ['GUILDS']
})

client.on('debug', console.log)

await client.connect()
console.log('Connected!')

setTimeout(() => {
  // client.gateway.reconnect()
  client.gateway.destroy()
}, 3000)
