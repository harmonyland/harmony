import { Client, Intents } from '../../mod.ts'
import { TOKEN } from './config.ts'

const client = new Client()

client.on('debug', console.log)

client.on('ready', () => {
  console.log(`Logged in as ${client.user?.tag}!`)
  client.guilds.get('783319033205751809').then((guild) => {
    if (guild === undefined) return console.log('Guild not found')
    guild
      .chunk({ presences: true }, true)
      .then((guild) => {
        console.log(`Chunked guild:`, guild.id)
      })
      .catch((e) => {
        console.log(`Failed to Chunk: ${guild.id} - ${e}`)
      })
  })
})

console.log('Connecting...')
client.connect(TOKEN, Intents.All)
