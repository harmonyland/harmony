import { User } from '../../structures/user.ts'
import { CLIENT_USER } from '../../types/endpoint.ts'
import type { Resume } from '../../types/gateway.ts'
import type { Gateway, GatewayEventHandler } from '../mod.ts'

export const resume: GatewayEventHandler = async (
  gateway: Gateway,
  d: Resume
) => {
  gateway.debug(`Session Resumed!`)
  gateway.client.emit('resumed', gateway.shards?.[0] ?? 0)
  if (gateway.client.user === undefined)
    gateway.client.user = new User(
      gateway.client,
      await gateway.client.rest.get(CLIENT_USER())
    )
}
