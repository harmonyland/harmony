import { Client, Intents } from '../mod.ts'
import { TOKEN } from './config.ts'

const client = new Client()

client.on('guildLoaded', async (guild) => {
  if (guild.id === 'GUILD_ID') {
    console.log((await guild.syncTemplate('TEMPLATE_ID')).code)
    console.log(
      (
        await guild.editTemplate('TEMPLATE_ID', {
          name: 'asdf',
          description: 'asdfasdfasdf'
        })
      ).code
    )
    console.log((await guild.deleteTemplate('TEMPLATE_ID')).id)
  }
})

client.connect(TOKEN, Intents.All)
