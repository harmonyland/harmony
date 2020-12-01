import { Gateway, GatewayEventHandler } from '../index.ts'
import { Guild } from '../../structures/guild.ts'
import { InviteDeletePayload } from '../../types/gateway.ts'

export const inviteDelete: GatewayEventHandler = async (
  gateway: Gateway,
  d: InviteDeletePayload
) => {
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const guild: Guild | undefined = await gateway.client.guilds.get(d.guild_id!)

  // Weird case, shouldn't happen
  if (guild === undefined) return

  const cachedInvite = await guild.invites.get(d.code)

  // Should not happen but here we go
  if (cachedInvite === undefined) return

  gateway.client.emit('inviteDelete', cachedInvite)
}
