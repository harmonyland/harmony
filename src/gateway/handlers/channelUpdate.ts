import cache from '../../models/cache.ts'
import { Channel } from '../../structures/channel.ts'
import getChannelByType from '../../utils/getChannelByType.ts'
import { Gateway, GatewayEventHandler } from '../index.ts'

export const channelUpdate: GatewayEventHandler = (
  gateway: Gateway,
  d: any
) => {
  const oldChannel: Channel = cache.get('channel', d.id)

  if (oldChannel !== undefined) {
    if (oldChannel.type !== d.type) {
      const channel: Channel = getChannelByType(gateway.client, d) ?? oldChannel
      gateway.client.emit('channelUpdate', oldChannel, channel)
    } else {
      const before = oldChannel.refreshFromData(d)
      gateway.client.emit('channelUpdate', before, oldChannel)
    }
  }
}
