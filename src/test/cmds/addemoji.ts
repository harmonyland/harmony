import { Command } from '../../../mod.ts'
import { CommandContext } from '../../models/command.ts'

export default class AddEmojiCommand extends Command {
  name = 'addemoji'
  aliases = ['ae', 'emojiadd']
  args = 2
  guildOnly = true

  execute(ctx: CommandContext): any {
    const name = ctx.args[0]
    if (name === undefined) return ctx.message.reply('No name was given!')
    const url = ctx.argString.slice(name.length).trim()
    if (url === '') return ctx.message.reply('No URL was given!')
    ctx.message.guild?.emojis
      .create(name, url)
      .then((emoji) => {
        if (emoji === undefined) throw new Error('Unknown')
        ctx.message.reply(
          `Successfuly added emoji ${emoji.toString()} ${emoji.name}!`
        )
      })
      .catch((e) => {
        ctx.message.reply(`Failed to add emoji. Reason: ${e.message}`)
      })
  }
}
