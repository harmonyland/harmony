import { Command, CommandContext } from '../../mod.ts'

export default class JoinCommand extends Command {
  name = 'join'
  guildOnly = true

  async execute(ctx: CommandContext): Promise<void> {
    const userVS = await ctx.guild?.voiceStates.get(ctx.author.id)
    if (userVS === undefined) {
      ctx.message.reply("You're not in VC.")
      return
    }
    await userVS.channel?.join()
    ctx.message.reply(`Joined VC channel - ${userVS.channel?.name}!`)
  }
}
