import { Guild } from "../../structures/guild.ts"
import { VoiceServerUpdatePayload } from "../../types/gateway.ts"
import { Gateway, GatewayEventHandler } from '../index.ts'

export const voiceServerUpdate: GatewayEventHandler = async (
  gateway: Gateway,
  d: VoiceServerUpdatePayload
) => {
  gateway.client.emit('voiceServerUpdate', {
    token: d.token,
    endpoint: d.endpoint,
    guild: (await gateway.client.guilds.get(d.guild_id) as unknown) as Guild
  })
}
