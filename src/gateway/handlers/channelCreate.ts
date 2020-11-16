import { Gateway, GatewayEventHandler } from '../index.ts'
import getChannelByType from '../../utils/getChannelByType.ts'
import { ChannelPayload } from '../../types/channel.ts'
import { Guild } from "../../structures/guild.ts"

export const channelCreate: GatewayEventHandler = async (
  gateway: Gateway,
  d: ChannelPayload
) => {
  const guild: undefined | Guild = (d as any).guild_id !== undefined ? await gateway.client.guilds.get((d as any).guild_id) : undefined
  const channel = getChannelByType(gateway.client, d, guild)
  if (channel !== undefined) {
    await gateway.client.channels.set(d.id, d)
    gateway.client.emit('channelCreate', channel)
  }
}
