import type { VoiceServerUpdatePayload } from '../../types/gateway.ts'
import type { Gateway, GatewayEventHandler } from '../mod.ts'

export const voiceServerUpdate: GatewayEventHandler = async (
  gateway: Gateway,
  d: VoiceServerUpdatePayload
) => {
  gateway.client.emit('voiceServerUpdate', {
    token: d.token,
    endpoint: d.endpoint,
    guild: await gateway.client.guilds.get(d.guild_id)
  })
}
