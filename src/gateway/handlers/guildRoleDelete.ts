import type { Gateway, GatewayEventHandler } from '../mod.ts'
import { Guild } from '../../structures/guild.ts'
import { GuildRoleDeletePayload } from '../../types/gateway.ts'

export const guildRoleDelete: GatewayEventHandler = async (
  gateway: Gateway,
  d: GuildRoleDeletePayload
) => {
  const guild: Guild | undefined = await gateway.client.guilds.get(d.guild_id)
  // Weird case, shouldn't happen
  if (guild === undefined) return

  const role = await guild.roles.get(d.role_id)
  // Shouldn't happen either
  if (role === undefined) return
  await guild.roles._delete(d.role_id)

  gateway.client.emit('guildRoleDelete', role)
}
