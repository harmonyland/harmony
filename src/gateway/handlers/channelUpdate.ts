import type { ChannelPayload } from '../../types/channel.ts'
import type { Gateway, GatewayEventHandler } from '../mod.ts'

export const channelUpdate: GatewayEventHandler = async (
  gateway: Gateway,
  d: ChannelPayload
) => {
  const oldChannel = await gateway.client.channels.get(d.id)
  await gateway.client.channels.set(d.id, d)
  const newChannel = (await gateway.client.channels.get(d.id))

  if (oldChannel !== undefined)
    gateway.client.emit('channelUpdate', oldChannel, newChannel)
  else
    gateway.client.emit('channelUpdateUncached', newChannel)
}
