import { Client, Message, Intents } from '../mod.ts'

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

client.connect(token, Intents.None)
