import { Channel } from '../../structures/channel.ts'
import getChannelByType from '../../utils/getChannelByType.ts'
import { Gateway, GatewayEventHandler } from '../index.ts'

export const channelUpdate: GatewayEventHandler = (
  gateway: Gateway,
  d: any
) => {
  const oldChannel: Channel = gateway.client.channels.get(d.id)

  if (oldChannel !== undefined) {
    gateway.client.channels.set(d.id, d)
    if (oldChannel.type !== d.type) {
      const channel: Channel = getChannelByType(gateway.client, d) ?? oldChannel
      gateway.client.emit('channelUpdate', oldChannel, channel)
    } else {
      const before = oldChannel.refreshFromData(d)
      gateway.client.emit('channelUpdate', before, oldChannel)
    }
  }
}
