import { Client, Intents } from '../../mod.ts'
import { TOKEN } from './config.ts'

const client = new Client()

client.on('ready', () => {
  console.log('Logged in!')
})

client.on('interactionCreate', async (d) => {
  await d.respond({
    content: `Hi, ${d.member.user.username}!`
  })
})

client.connect(TOKEN, Intents.None)
