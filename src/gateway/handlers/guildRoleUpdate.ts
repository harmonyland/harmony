import type { Gateway, GatewayEventHandler } from '../mod.ts'
import { Guild } from '../../structures/guild.ts'
import { GuildRoleUpdatePayload } from '../../types/gateway.ts'
import { Role } from '../../structures/role.ts'

export const guildRoleUpdate: GatewayEventHandler = async (
  gateway: Gateway,
  d: GuildRoleUpdatePayload
) => {
  const guild: Guild | undefined = await gateway.client.guilds.get(d.guild_id)
  // Weird case, shouldn't happen
  if (guild === undefined) return

  const role = await guild.roles.get(d.role.id)
  await guild.roles.set(d.role.id, d.role)
  const newRole = (await guild.roles.get(d.role.id)) as Role

  // Shouldn't happen either
  if (role === undefined)
    return gateway.client.emit('guildRoleUpdateUncached', newRole)

  gateway.client.emit('guildRoleUpdate', role, newRole)
}
