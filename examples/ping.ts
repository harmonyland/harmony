import { Client, Message, GatewayIntents } from '../mod.ts'

const client = new Client()

client.on('ready', () => {
  console.log(`Logged in as ${client.user?.tag}!`)
})

client.on('messageCreate', (msg: Message) => {
  if (msg.content === '!ping') {
    console.log('Command Used: Ping')
    msg.reply('pong!')
  }
})

console.log('Harmony - Ping Example')

const token = prompt('Input Bot Token:')
if (token === null) {
  console.log('No token provided')
  Deno.exit()
}

// You can also use Intents.None (all intents without priviliged ones, Intents.All has all of them)
// to not have to specify intents manually, but it is recommended to specify intents only which are needed!
// It makes your bot more memory efficient and uses less bandwidth.
client.connect(token, [
  GatewayIntents.GUILD_MESSAGES,
  GatewayIntents.GUILDS,
  GatewayIntents.DIRECT_MESSAGES
])
