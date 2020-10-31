import { Gateway, GatewayEventHandler } from '../index.ts'
import cache from '../../models/cache.ts'
import { Guild } from '../../structures/guild.ts'
import { User } from '../../structures/user.ts'

export const guildBanRemove: GatewayEventHandler = (
  gateway: Gateway,
  d: any
) => {
  const guild: Guild = cache.get('guild', d.guild_id)
  const user: User =
    cache.get('user', d.user.id) ?? new User(gateway.client, d.user)

  if (guild !== undefined) {
    gateway.client.emit('guildBanRemove', guild, user)
  }
}
