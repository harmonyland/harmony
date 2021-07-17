import { Command, CommandContext } from '../../mod.ts'

export default class EvalCommand extends Command {
  name = 'eval'
  ownerOnly = true

  async execute(ctx: CommandContext): Promise<void> {
    try {
      // eslint-disable-next-line no-eval
      let evaled = eval(ctx.argString)
      if (evaled instanceof Promise) evaled = await evaled
      if (typeof evaled === 'object') evaled = Deno.inspect(evaled)
      await ctx.message.reply(
        `\`\`\`js\n${`${evaled}`.substring(0, 1990)}\n\`\`\``
      )
    } catch (e) {
      ctx.message.reply(`\`\`\`js\n${e.stack}\n\`\`\``)
    }
  }
}
