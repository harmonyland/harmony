import type { Gateway, GatewayEventHandler } from '../mod.ts'
import { Guild } from '../../structures/guild.ts'
import { User } from '../../structures/user.ts'
import { GuildBanAddPayload } from '../../types/gateway.ts'

export const guildBanAdd: GatewayEventHandler = async (
  gateway: Gateway,
  d: GuildBanAddPayload
) => {
  const guild: Guild | undefined = await gateway.client.guilds.get(d.guild_id)
  const user: User =
    (await gateway.client.users.get(d.user.id)) ??
    new User(gateway.client, d.user)

  if (guild !== undefined) {
    // We don't have to delete member, already done with guildMemberRemove event
    gateway.client.emit('guildBanAdd', guild, user)
  }
}
