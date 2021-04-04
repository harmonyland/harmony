import { Command } from '../../../mod.ts'
import { CommandContext } from '../../models/command.ts'

export default class PingCommand extends Command {
  name = 'ping'

  execute(ctx: CommandContext): void {
    console.log(ctx.args, ctx.argString)
    ctx.message.reply(`Pong! Latency: ${ctx.client.ping}ms`)
  }
}
