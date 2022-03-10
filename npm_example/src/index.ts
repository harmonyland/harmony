import * as harmony from 'harmony'

// Reads from DISCORD_TOKEN env by default.
const client = new harmony.Client({
  intents: [
    'GUILDS',
    'GUILD_MESSAGES',
    'DIRECT_MESSAGES',
    'GUILD_MEMBERS',
    'GUILD_PRESENCES'
  ]
})

client.on('messageCreate', async (msg) => {
  if (msg.content === '!ping') {
    await msg.channel.send(`Pong!`)
  }
})

client.connect().then(() => console.log(`Ready!`))
