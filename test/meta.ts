import {
  CommandClient,
  Command,
  Intents,
  CommandOptions,
  CommandContext
} from '../mod.ts'
import { TOKEN } from './config.ts'

const client = new CommandClient({
  prefix: '!',
  token: TOKEN,
  intents: Intents.None
})

class Ping extends Command {
  static meta: CommandOptions = {
    name: 'ping',
    aliases: 'pong'
  }

  execute(ctx: CommandContext): void {
    ctx.message.reply('Pong!')
  }
}

client.commands.add(Ping)

client.connect()
