import { Guild } from '../../structures/guild.ts'
import { GuildPayload } from '../../types/guild.ts'
import { Gateway, GatewayEventHandler } from '../index.ts'

export const guildDelte: GatewayEventHandler = async (
  gateway: Gateway,
  d: GuildPayload
) => {
  const guild: Guild | undefined = await gateway.client.guilds.get(d.id)

  if (guild !== undefined) {
    guild.refreshFromData(d)

    await guild.members.flush()
    await guild.channels.flush()
    await guild.roles.flush()
    await gateway.client.guilds.delete(d.id)

    gateway.client.emit('guildDelete', guild)
  }
}
