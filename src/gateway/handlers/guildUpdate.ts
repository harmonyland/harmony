import { Gateway, GatewayEventHandler } from '../index.ts'
import { Guild } from '../../structures/guild.ts'
import { GuildPayload } from '../../types/guild.ts'

export const guildUpdate: GatewayEventHandler = async (
  gateway: Gateway,
  d: GuildPayload
) => {
  const after: Guild | undefined = await gateway.client.guilds.get(d.id)
  if (after === undefined) return
  const before = after.refreshFromData(d)
  await gateway.client.guilds.set(d.id, d)
  gateway.client.emit('guildUpdate', before, after)
}
