import { Guild } from '../../structures/guild.ts'
import { GuildPayload } from '../../types/guild.ts'
import type { Gateway, GatewayEventHandler } from '../mod.ts'

export const guildDelete: GatewayEventHandler = async (
  gateway: Gateway,
  d: GuildPayload
) => {
  // It will be removed anyway if its deleted
  await gateway.client.guilds.set(d.id, d)
  const guild: Guild | undefined = await gateway.client.guilds.get(d.id)
  if ('unavailable' in d) {
    gateway.client.emit('guildUnavailable', guild)
    return
  }

  if (guild !== undefined) {
    await guild.members.flush()
    await guild.channels.flush()
    await guild.roles.flush()
    await guild.presences.flush()
    await guild.emojis.flush()
    await guild.stickers.flush()
    await gateway.client.guilds._delete(d.id)

    gateway.client.emit('guildDelete', guild)
  }
}
