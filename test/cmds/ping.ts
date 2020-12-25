import { Command, CommandContext } from '../../mod.ts'

export default class PingCommand extends Command {
  name = 'ping'

  execute(ctx: CommandContext): void {
    ctx.message.reply(`Pong! Latency: ${ctx.client.ping}ms`)
  }
}
