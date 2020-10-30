import { Gateway, GatewayEventHandler } from '../index.ts'
import cache from '../../models/cache.ts'
import { TextChannel } from '../../structures/textChannel.ts'

export const channelPinsUpdate: GatewayEventHandler = (
  gateway: Gateway,
  d: any
) => {
  const after: TextChannel = cache.get('textchannel', d.channel_id)
  if (after !== undefined) {
    const before = after.refreshFromData({
      last_pin_timestamp: d.last_pin_timestamp
    })
    gateway.client.emit('channelPinsUpdate', before, after)
  }
}
