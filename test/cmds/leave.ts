import { Command, CommandContext } from '../../mod.ts'

export default class LeaveCommand extends Command {
  name = 'leave'
  guildOnly = true

  async execute(ctx: CommandContext): Promise<void> {
    const userVS = await ctx.guild?.voiceStates.get(
      ctx.client.user?.id as unknown as string
    )
    if (userVS === undefined) {
      ctx.message.reply("I'm not in VC.")
      return
    }
    userVS.channel?.leave()
    ctx.message.reply(`Left VC channel - ${userVS.channel?.name}!`)
  }
}
