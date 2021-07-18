import * as discord from '../mod.ts'
import { TOKEN } from './config.ts'

const client = new discord.CommandClient({
  token: TOKEN,
  prefix: '!',
  intents: ['GUILDS', 'GUILD_MESSAGES']
})

class Test extends discord.Command {
  name = 'test'

  execute(ctx: discord.CommandContext): void {
    ctx.message.reply(
      `Test Command 1.\nArgs: ${ctx.rawArgs.join(', ')}\nArgString: ${
        ctx.argString
      }`
    )
  }

  @discord.subcommand()
  sub(ctx: discord.CommandContext): void {
    ctx.message.reply(
      `Test Sub Command.\nArgs: ${ctx.rawArgs.join(', ')}\nArgString: ${
        ctx.argString
      }`
    )
  }
}

class Command extends discord.Command {
  execute(ctx: discord.CommandContext): void {
    ctx.message.reply(
      `Root Command.\nArgs: ${ctx.rawArgs.join(', ')}\nArgString: ${
        ctx.argString
      }`
    )
  }

  subCommands = [new Test()]

  @discord.subcommand()
  sub(ctx: discord.CommandContext): void {
    ctx.message.reply(
      `Sub Command.\nArgs: ${ctx.rawArgs.join(', ')}\nArgString: ${
        ctx.argString
      }`
    )
  }

  @discord.subcommand()
  sub2(ctx: discord.CommandContext): void {
    ctx.message.reply(
      `Sub Command 2.\nArgs: ${ctx.rawArgs.join(', ')}\nArgString: ${
        ctx.argString
      }`
    )
  }
}

client.commands.add(Command)

client.connect().then(() => console.log('Ready!'))
