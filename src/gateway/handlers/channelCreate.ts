import { Gateway, GatewayEventHandler } from '../index.ts'
import getChannelByType from '../../utils/getChannelByType.ts'

export const channelCreate: GatewayEventHandler = (
  gateway: Gateway,
  d: any
) => {
  const channel = getChannelByType(gateway.client, d)

  if (channel !== undefined) {
    gateway.client.emit('channelCreate', channel)
  }
}
