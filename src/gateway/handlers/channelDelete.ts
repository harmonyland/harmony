import { Gateway, GatewayEventHandler } from '../index.ts'
import { Channel } from '../../structures/channel.ts'

export const channelDelete: GatewayEventHandler = async(
  gateway: Gateway,
  d: any
) => {
  const channel: Channel | void = await gateway.client.channels.get(d.id)
  if (channel !== undefined) {
    await gateway.client.channels.delete(d.id)
    gateway.client.emit('channelDelete', channel)
  }
}
