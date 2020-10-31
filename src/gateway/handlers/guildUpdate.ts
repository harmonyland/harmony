import { Gateway, GatewayEventHandler } from '../index.ts'
import cache from '../../models/cache.ts'
import { Guild } from '../../structures/guild.ts'

export const guildUpdate: GatewayEventHandler = (gateway: Gateway, d: any) => {
  const before: Guild | void = gateway.client.guilds.get(d.id)
  if(!before) return
  gateway.client.guilds.set(d.id, d)
  const after: Guild | void = gateway.client.guilds.get(d.id)
  gateway.client.emit('guildUpdate', before, after)
}
