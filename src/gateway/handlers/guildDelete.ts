import { Guild } from '../../structures/guild.ts'
import { GuildPayload } from '../../types/guild.ts'
import { Gateway, GatewayEventHandler } from '../index.ts'

export const guildDelete: GatewayEventHandler = async (
  gateway: Gateway,
  d: GuildPayload
) => {
  const guild: Guild | undefined = await gateway.client.guilds.get(d.id)

  if (guild !== undefined) {
    await guild.members.flush()
    await guild.channels.flush()
    await guild.roles.flush()
    await guild.presences.flush()
    await gateway.client.guilds._delete(d.id)

    gateway.client.emit('guildDelete', guild)
  }
}
