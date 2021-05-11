import { Command, CommandContext } from '../../mod.ts'

export default class PingCommand extends Command {
  name = 'ping'

  execute(ctx: CommandContext): void {
    console.log(ctx.args, ctx.argString)
    ctx.message.reply(`Pong! Latency: ${ctx.client.gateway.ping}ms`)
  }
}
