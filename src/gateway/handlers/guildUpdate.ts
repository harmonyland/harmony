import { Gateway, GatewayEventHandler } from '../index.ts'
import { Guild } from '../../structures/guild.ts'

export const guildUpdate: GatewayEventHandler = async(gateway: Gateway, d: any) => {
  const before: Guild | void = await gateway.client.guilds.get(d.id)
  if(!before) return
  await gateway.client.guilds.set(d.id, d)
  const after: Guild | void = await gateway.client.guilds.get(d.id)
  gateway.client.emit('guildUpdate', before, after)
}
