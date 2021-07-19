import type { Gateway, GatewayEventHandler } from '../mod.ts'
import { GuildRoleCreatePayload } from '../../types/gateway.ts'

export const guildRoleCreate: GatewayEventHandler = async (
  gateway: Gateway,
  d: GuildRoleCreatePayload
) => {
  const guild = await gateway.client.guilds.get(d.guild_id)
  // Weird case, shouldn't happen
  if (guild === undefined) return

  await guild.roles.set(d.role.id, d.role)
  const role = await guild.roles.get(d.role.id)
  gateway.client.emit('guildRoleCreate', role)
}
