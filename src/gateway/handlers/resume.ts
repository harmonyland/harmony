import { User } from '../../structures/user.ts'
import { CLIENT_USER } from '../../types/endpoint.ts'
import { Resume } from '../../types/gateway.ts'
import { Gateway, GatewayEventHandler } from '../index.ts'

export const resume: GatewayEventHandler = async (
  gateway: Gateway,
  d: Resume
) => {
  gateway.debug(`Session Resumed!`)
  gateway.client.emit('resume')
  if (gateway.client.user === undefined)
    gateway.client.user = new User(
      gateway.client,
      await gateway.client.rest.get(CLIENT_USER())
    )
  gateway.client.emit('ready')
}
