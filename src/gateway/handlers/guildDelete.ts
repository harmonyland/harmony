import cache from '../../models/cache.ts'
import { Guild } from '../../structures/guild.ts'
import { Gateway, GatewayEventHandler } from '../index.ts'

export const guildDelte: GatewayEventHandler = (gateway: Gateway, d: any) => {
  const guild: Guild = cache.get('guild', d.id)

  if (guild !== undefined) {
    guild.refreshFromData(d)
    cache.del('guild', d.id)
    gateway.client.emit('guildDelete', guild)
  }
}
