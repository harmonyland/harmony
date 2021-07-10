import type { PresenceUpdatePayload } from '../../types/gateway.ts'
import type { Gateway, GatewayEventHandler } from '../mod.ts'

export const presenceUpdate: GatewayEventHandler = async (
  gateway: Gateway,
  d: PresenceUpdatePayload
) => {
  const guild = await gateway.client.guilds.get(d.guild_id)
  if (guild === undefined) return

  await gateway.client.users.set(d.user.id, d.user)
  await guild.presences.set(d.user.id, d)
  const presence = await guild.presences.get(d.user.id)
  if (presence === undefined) return

  gateway.client.emit('presenceUpdate', presence)
}
