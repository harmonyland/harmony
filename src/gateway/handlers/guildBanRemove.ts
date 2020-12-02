import { Gateway, GatewayEventHandler } from '../index.ts'
import { Guild } from '../../structures/guild.ts'
import { User } from '../../structures/user.ts'
import { GuildBanRemovePayload } from '../../types/gateway.ts'

export const guildBanRemove: GatewayEventHandler = async (
  gateway: Gateway,
  d: GuildBanRemovePayload
) => {
  const guild: Guild | undefined = await gateway.client.guilds.get(d.guild_id)
  const user: User =
    (await gateway.client.users.get(d.user.id)) ??
    new User(gateway.client, d.user)

  if (guild !== undefined) {
    gateway.client.emit('guildBanRemove', guild, user)
  }
}
