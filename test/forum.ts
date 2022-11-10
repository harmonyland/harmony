import { Client, GuildForumChannel, Intents } from '../mod.ts'
// import type {  } from '../mod.ts'
import { TOKEN } from './config.ts'

const client = new Client()

client.on('ready', async () => {
  const guild = await client.guilds.resolve('GUILD_ID')
  if (guild !== undefined) {
    console.log('found guild')
    const channel = await guild.channels.resolve('CHANNEL_ID')
    if (channel !== undefined && channel instanceof GuildForumChannel) {
      console.log('found channel')
      const threads = await channel.threads.array()
      console.log(threads)
      const thread = await channel.startThread({
        name: 'also test',
        autoArchiveDuration: 60,
        message: {
          content: 'test'
        }
      })
      thread.send('it works')
    }
  }
})

client.connect(TOKEN, Intents.NonPrivileged)
