import { Guild } from '../../structures/guild.ts'
import { VoiceState } from '../../structures/voiceState.ts'
import { MemberPayload } from '../../types/guild.ts'
import { VoiceStatePayload } from '../../types/voice.ts'
import { Gateway, GatewayEventHandler } from '../index.ts'

export const voiceStateUpdate: GatewayEventHandler = async (
  gateway: Gateway,
  d: VoiceStatePayload
) => {
  if (d.guild_id === undefined) return
  const guild = ((await gateway.client.guilds.get(
    d.guild_id
  )) as unknown) as Guild

  const voiceState = await guild.voiceStates.get(d.user_id)

  if (d.channel_id === null) {
    if (voiceState === undefined) {
      await guild.members.set(d.user_id, (d.member as unknown) as MemberPayload)
      const member = ((await guild.members.get(
        d.user_id
      )) as unknown) as MemberPayload
      return gateway.client.emit('voiceStateRemoveUncached', { guild, member })
    }
    // No longer in the channel, so delete
    await guild.voiceStates.delete(d.user_id)
    gateway.client.emit(
      'voiceStateRemove',
      (voiceState as unknown) as VoiceState
    )
    return
  }

  await guild.voiceStates.set(d.user_id, d)
  const newVoiceState = await guild.voiceStates.get(d.user_id)
  if (voiceState === undefined) {
    gateway.client.emit(
      'voiceStateAdd',
      (newVoiceState as unknown) as VoiceState
    )
  } else {
    gateway.client.emit(
      'voiceStateUpdate',
      voiceState,
      (newVoiceState as unknown) as VoiceState
    )
  }
}
