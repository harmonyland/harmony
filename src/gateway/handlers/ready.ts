import { Guild } from '../../structures/guild.ts'
import { User } from '../../structures/user.ts'
import { GuildPayload } from '../../types/guildTypes.ts'
import { Gateway, GatewayEventHandler } from '../index.ts'

export const ready: GatewayEventHandler = (gateway: Gateway, d: any) => {
  gateway.client.user = new User(gateway.client, d.user)
  gateway.sessionID = d.session_id
  d.guilds.forEach((guild: GuildPayload) => new Guild(gateway.client, guild))
  gateway.client.emit('ready')
}
