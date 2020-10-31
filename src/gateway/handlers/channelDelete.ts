import { Gateway, GatewayEventHandler } from '../index.ts'
import { Channel } from '../../structures/channel.ts'

export const channelDelete: GatewayEventHandler = (
  gateway: Gateway,
  d: any
) => {
  const channel: Channel = gateway.client.channels.get(d.id)
  if (channel !== undefined) {
    gateway.client.channels.delete(d.id)
    gateway.client.emit('channelDelete', channel)
  }
}
