import { Gateway, GatewayEventHandler } from '../index.ts'
import cache from '../../models/cache.ts'
import { Guild } from '../../structures/guild.ts'

export const guildCreate: GatewayEventHandler = (gateway: Gateway, d: any) => {
  let guild: Guild = cache.get('guild', d.id)
  if (guild !== undefined) {
    guild.refreshFromData(d)
  } else {
    guild = new Guild(gateway.client, d)
  }

  gateway.client.emit('guildCreate', guild)
}
