import { Command, VoiceChannel } from '../../../mod.ts'
import { CommandContext } from '../../models/command.ts'
import { ChannelTypes } from '../../types/channel.ts'

export default class KickFromSpecificVoiceCommand extends Command {
  name = 'kickFromSpecificVoice'

  async execute(ctx: CommandContext): Promise<void> {
    if (ctx.guild !== undefined) {
      const channel = await ctx.guild.channels.get('YOUR VOICE CHANNEL ID')
      if (channel === undefined || channel.type !== ChannelTypes.GUILD_VOICE) {
        ctx.channel.send('The channel is either not a voice or not available.')
        return
      }

      // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
      const voiceStates = await (channel as VoiceChannel).voiceStates.array()
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
