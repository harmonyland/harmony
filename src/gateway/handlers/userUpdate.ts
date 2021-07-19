import type { UserPayload } from '../../types/user.ts'
import type { Gateway, GatewayEventHandler } from '../mod.ts'

export const userUpdate: GatewayEventHandler = async (
  gateway: Gateway,
  d: UserPayload
) => {
  const oldUser = await gateway.client.users.get(d.id)
  await gateway.client.users.set(d.id, d)
  const newUser = await gateway.client.users.get(d.id)

  if (oldUser !== undefined) {
    gateway.client.emit('userUpdate', oldUser, newUser)
  } else gateway.client.emit('userUpdateUncached', newUser)
}
