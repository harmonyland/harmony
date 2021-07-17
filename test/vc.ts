import * as discord from '../mod.ts'
import { TOKEN } from './config.ts'

const client = new discord.Client({
  token: TOKEN,
  intents: ['GUILDS', 'GUILD_VOICE_STATES', 'GUILD_MESSAGES']
})

client.on('messageCreate', async (msg) => {
  if (msg.author.bot === true || msg.guild === undefined) return

  if (msg.content === '!join') {
    const vs = await msg.guild.voiceStates.get(msg.author.id)
    if (vs === undefined) return msg.reply("You're not in Voice Channel!")
    const data = await vs.channel!.join()
    console.log(data)
    msg.reply('Joined voice channel.')
  } else if (msg.content === '!leave') {
    const vs = await msg.guild.voiceStates.get(msg.client.user!.id!)
    if (vs === undefined) return msg.reply("I'm not in Voice Channel!")
    await vs.channel!.leave()
    msg.reply('Left voice channel.')
  }
})

client.connect().then(() => console.log('Ready!'))
