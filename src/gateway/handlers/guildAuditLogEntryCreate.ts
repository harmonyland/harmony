import { Guild } from '../../../mod.ts'
import { transformAuditLogEntryPayload } from '../../structures/guild.ts'
import { GuildAuditLogEntryCreatePayload } from '../../types/gateway.ts'
import type { Gateway, GatewayEventHandler } from '../mod.ts'

export const guildAuditLogEntryCreate: GatewayEventHandler = async (
  gateway: Gateway,
  d: GuildAuditLogEntryCreatePayload
) => {
  const guild: Guild | undefined = await gateway.client.guilds.get(d.guild_id)
  if (guild != null) {
    const entry = transformAuditLogEntryPayload(d)
    gateway.client.emit('guildAuditLogEntryCreate', guild, entry)
  }
}
