import { Client, Intents } from '../mod.ts'
import { TOKEN } from './config.ts'

const client = new Client()

client.on('debug', console.log)

client.on('ready', () => {
  console.log(`Logged in as ${client.user?.tag}!`)
})

client.on('guildLoaded', async (guild) => {
  if (guild.id !== '783319033205751809') return
  const arr = await guild.channels.array()
  console.log(arr.length)
  guild
    .chunk({ presences: true }, true)
    .then((guild) => {
      console.log(`Chunked guild:`, guild.id)
    })
    .catch((e) => {
      console.log(`Failed to Chunk: ${guild.id} - ${e}`)
    })
})

console.log('Connecting...')
client.connect(TOKEN, Intents.All)
