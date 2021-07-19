import type { Gateway, GatewayEventHandler } from '../mod.ts'
import getChannelByType from '../../utils/channel.ts'
import type {
  ChannelPayload,
  GuildChannelPayload
} from '../../types/channel.ts'

export const channelCreate: GatewayEventHandler = async (
  gateway: Gateway,
  d: ChannelPayload
) => {
  const guild =
    'guild_id' in d
      ? 
        await gateway.client.guilds.get((d as GuildChannelPayload).guild_id)
      : undefined
  const channel = getChannelByType(gateway.client, d, guild)
  if (channel !== undefined) {
    await gateway.client.channels.set(d.id, d)
    gateway.client.emit('channelCreate', channel)
  }
}
