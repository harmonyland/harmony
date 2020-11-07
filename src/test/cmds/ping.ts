import { Command } from "../../../mod.ts";
import { CommandContext } from "../../models/command.ts";

export default class PingCommand extends Command {
  name = "ping"
  dmOnly = true

  execute(ctx: CommandContext): void {
    ctx.message.reply(`pong! Latency: ${ctx.client.ping}ms`)
  }
}