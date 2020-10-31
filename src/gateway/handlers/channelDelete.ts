import { Gateway, GatewayEventHandler } from '../index.ts'
import cache from '../../models/cache.ts'
import { Channel } from '../../structures/channel.ts'

export const channelDelete: GatewayEventHandler = (
  gateway: Gateway,
  d: any
) => {
  const channel: Channel = cache.get('channel', d.id)
  if (channel !== undefined) {
    cache.del('channel', d.id)
    gateway.client.emit('channelDelete', channel)
  }
}
