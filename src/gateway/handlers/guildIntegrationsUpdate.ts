import type { Gateway, GatewayEventHandler } from '../mod.ts'
import { Guild } from '../../structures/guild.ts'
import { GuildIntegrationsUpdatePayload } from '../../types/gateway.ts'

export const guildIntegrationsUpdate: GatewayEventHandler = async (
  gateway: Gateway,
  d: GuildIntegrationsUpdatePayload
) => {
  const guild: Guild | undefined = await gateway.client.guilds.get(d.guild_id)
  if (guild === undefined) return

  gateway.client.emit('guildIntegrationsUpdate', guild)
}
