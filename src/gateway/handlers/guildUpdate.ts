import type { Gateway, GatewayEventHandler } from '../mod.ts'
import { Guild } from '../../structures/guild.ts'
import { GuildPayload } from '../../types/guild.ts'

export const guildUpdate: GatewayEventHandler = async (
  gateway: Gateway,
  d: GuildPayload
) => {
  const before: Guild | undefined = await gateway.client.guilds.get(d.id)
  if (before === undefined) return
  await gateway.client.guilds.set(d.id, d)
  const after = (await gateway.client.guilds.get(d.id)) as unknown as Guild
  gateway.client.emit('guildUpdate', before, after)
}
