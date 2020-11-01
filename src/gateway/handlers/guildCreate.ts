import { Gateway, GatewayEventHandler } from '../index.ts'
import { Guild } from '../../structures/guild.ts'
import { GuildPayload } from "../../types/guild.ts"

export const guildCreate: GatewayEventHandler = async(gateway: Gateway, d: GuildPayload) => {
  let guild: Guild | void = await gateway.client.guilds.get(d.id)
  if (guild !== undefined) {
    // It was just lazy load, so we don't fire the event as its gonna fire for every guild bot is in
    await gateway.client.guilds.set(d.id, d)
    guild.refreshFromData(d)
  } else {
    await gateway.client.guilds.set(d.id, d)
    guild = new Guild(gateway.client, d as GuildPayload)
    await guild.roles.fromPayload(d.roles)
    gateway.client.emit('guildCreate', guild)
  }
}
