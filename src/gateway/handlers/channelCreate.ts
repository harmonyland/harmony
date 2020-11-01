import { Gateway, GatewayEventHandler } from '../index.ts'
import getChannelByType from '../../utils/getChannelByType.ts'

export const channelCreate: GatewayEventHandler = async (
  gateway: Gateway,
  d: any
) => {
  const channel = getChannelByType(gateway.client, d)
  if (channel !== undefined) {
    await gateway.client.channels.set(d.id, d)
    gateway.client.emit('channelCreate', channel)
  }
}
