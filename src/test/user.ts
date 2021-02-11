import { Client, Intents } from '../../mod.ts'
import { TOKEN } from './config.ts'

const client = new Client()

client.on('ready', async () => {
  client.editUser({
    username: 'Learning'
  })
  const channel = await client.createDM('USER_ID')
  channel.send('nice')
})

client.connect(TOKEN, Intents.All)
