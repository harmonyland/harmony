import { Channel } from '../../structures/channel.ts'
import { ChannelPayload } from '../../types/channel.ts'
import getChannelByType from '../../utils/getChannelByType.ts'
import { Gateway, GatewayEventHandler } from '../index.ts'

export const channelUpdate: GatewayEventHandler = async (
  gateway: Gateway,
  d: ChannelPayload
) => {
  const oldChannel: Channel = await gateway.client.channels.get(d.id)

  if (oldChannel !== undefined) {
    await gateway.client.channels.set(d.id, d)
    if (oldChannel.type !== d.type) {
      const channel: Channel = getChannelByType(gateway.client, d) ?? oldChannel
      gateway.client.emit('channelUpdate', oldChannel, channel)
    } else {
      const before = oldChannel.refreshFromData(d)
      gateway.client.emit('channelUpdate', before, oldChannel)
    }
  }
}
