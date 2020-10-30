import { Gateway, GatewayEventHandler } from '../index.ts'
import cache from '../../models/cache.ts'
import { Guild } from '../../structures/guild.ts'

export const guildUpdate: GatewayEventHandler = (gateway: Gateway, d: any) => {
  const after: Guild = cache.get('guild', d.id)
  if (after !== undefined) {
    const before: Guild = after.refreshFromData(d)
    gateway.client.emit('guildUpdate', before, after)
  }
}
