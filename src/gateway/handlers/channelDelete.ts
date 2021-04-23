import type { Gateway, GatewayEventHandler } from '../mod.ts'
import type { ChannelPayload } from '../../types/channel.ts'

export const channelDelete: GatewayEventHandler = async (
  gateway: Gateway,
  d: ChannelPayload
) => {
  const channel = await gateway.client.channels.get(d.id)
  if (channel !== undefined) {
    await gateway.client.channels._delete(d.id)
    gateway.client.emit('channelDelete', channel)
  }
}
