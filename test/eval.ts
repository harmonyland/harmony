/* eslint-disable no-eval */
import * as discord from '../mod.ts'
import { TOKEN } from './config.ts'

const client = new discord.Client({
  token: TOKEN,
  intents: ['GUILD_MESSAGES', 'GUILDS']
})

client.on('messageCreate', async (msg) => {
  if (msg.author.id !== '422957901716652033') return

  if (msg.content.startsWith('.eval') === true) {
    let code = msg.content.slice(5).trim()
    if (code.startsWith('```') === true) code = code.slice(3).trim()
    if (code.endsWith('```') === true) code = code.substr(0, code.length - 3)
    try {
      const result = await eval(code)
      msg.reply(
        `\`\`\`js\n${Deno.inspect(result).substr(0, 2000 - 20)}\n\`\`\``
      )
    } catch (e) {
      msg.reply(`\`\`\`js\n${(e as Error).stack}\n\`\`\``, {
        allowedMentions: { replied_user: false }
      })
    }
  }
})

client.connect().then(() => console.log('Ready!'))
