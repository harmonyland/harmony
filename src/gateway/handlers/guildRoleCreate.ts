import type { Gateway, GatewayEventHandler } from '../mod.ts'
import { Guild } from '../../structures/guild.ts'
import { GuildRoleCreatePayload } from '../../types/gateway.ts'
import { Role } from '../../structures/role.ts'

export const guildRoleCreate: GatewayEventHandler = async (
  gateway: Gateway,
  d: GuildRoleCreatePayload
) => {
  const guild: Guild | undefined = await gateway.client.guilds.get(d.guild_id)
  // Weird case, shouldn't happen
  if (guild === undefined) return

  await guild.roles.set(d.role.id, d.role)
  const role = (await guild.roles.get(d.role.id)) as Role
  gateway.client.emit('guildRoleCreate', role)
}
