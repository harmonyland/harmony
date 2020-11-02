import { Gateway, GatewayEventHandler } from '../index.ts'
import { Channel } from '../../structures/channel.ts'
import { ChannelPayload } from '../../types/channel.ts'

export const channelDelete: GatewayEventHandler = async (
  gateway: Gateway,
  d: ChannelPayload
) => {
  const channel: Channel = await gateway.client.channels.get(d.id)
  if (channel !== undefined) {
    await gateway.client.channels.delete(d.id)
    gateway.client.emit('channelDelete', channel)
  }
}
