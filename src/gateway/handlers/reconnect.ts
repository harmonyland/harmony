import type { Gateway, GatewayEventHandler } from '../mod.ts'

export const reconnect: GatewayEventHandler = async (
  gateway: Gateway,
  // Why is this here?
  _d: any
): Promise<void> => {
  gateway.client.emit('reconnect', gateway.shards?.[0] ?? 0)
  await gateway.reconnect()
}
