import * as discord from '../mod.ts'
import { TOKEN } from './config.ts'

const client = new discord.CommandClient({
  token: TOKEN,
  prefix: '!',
  intents: ['GUILDS', 'GUILD_MESSAGES']
})

class Command extends discord.Command {
  execute(ctx: discord.CommandContext): void {
    ctx.message.reply('Root Command')
  }

  @discord.subcommand()
  sub(ctx: discord.CommandContext): void {
    ctx.message.reply('Sub Command')
  }
}

client.commands.add(Command)

client.connect().then(() => console.log('Ready!'))
