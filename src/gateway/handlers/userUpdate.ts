import type { User } from '../../structures/user.ts'
import type { UserPayload } from '../../types/user.ts'
import type { Gateway, GatewayEventHandler } from '../mod.ts'

export const userUpdate: GatewayEventHandler = async (
  gateway: Gateway,
  d: UserPayload
) => {
  const oldUser: User | undefined = await gateway.client.users.get(d.id)
  await gateway.client.users.set(d.id, d)
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
  const newUser = (await gateway.client.users.get(d.id)) as User

  if (oldUser !== undefined) {
    gateway.client.emit('userUpdate', oldUser, newUser)
  } else gateway.client.emit('userUpdateUncached', newUser)
}
