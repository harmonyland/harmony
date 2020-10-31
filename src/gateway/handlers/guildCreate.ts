import { Gateway, GatewayEventHandler } from '../index.ts'
import { Guild } from '../../structures/guild.ts'

export const guildCreate: GatewayEventHandler = (gateway: Gateway, d: any) => {
  let guild: Guild | void = gateway.client.guilds.get(d.id)
  if (guild !== undefined) {
    // It was just lazy load, so we don't fire the event as its gonna fire for every guild bot is in
    gateway.client.guilds.set(d.id, d)
    guild.refreshFromData(d)
  } else {
    gateway.client.guilds.set(d.id, d)
    guild = gateway.client.guilds.get(d.id)
    gateway.client.emit('guildCreate', guild)
  }
}
