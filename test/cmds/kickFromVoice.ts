import { Command, CommandContext } from '../../mod.ts'

export default class KickFromVoiceCommand extends Command {
  name = 'kickFromVoice'

  async execute(ctx: CommandContext): Promise<void> {
    if (ctx.guild !== undefined) {
      const voiceStates = await ctx.guild.voiceStates.array()
      if (voiceStates !== undefined) {
        voiceStates.forEach(async (voiceState) => {
          const member = await voiceState.disconnect()
          if (member !== undefined) {
            ctx.channel.send(`Kicked member ${member.id}`)
          }
        })
      }
    }
  }
}
