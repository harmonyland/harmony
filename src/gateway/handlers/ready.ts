import { User } from '../../structures/user.ts'
import { GuildPayload } from '../../types/guildTypes.ts'
import { Gateway, GatewayEventHandler } from '../index.ts'

export const ready: GatewayEventHandler = async (gateway: Gateway, d: any) => {
  gateway.client.user = new User(gateway.client, d.user)
  gateway.sessionID = d.session_id
  gateway.debug(`Received READY. Session: ${gateway.sessionID}`)
  await gateway.cache.set("session_id", gateway.sessionID)
  d.guilds.forEach((guild: GuildPayload) => {
    gateway.client.guilds.set(guild.id, guild)
  })
  gateway.client.emit('ready')
}