import type { Gateway, GatewayEventHandler } from '../mod.ts'
import { Guild } from '../../structures/guild.ts'
import { GuildBanAddPayload } from '../../types/gateway.ts'

export const guildBanAdd: GatewayEventHandler = async (
  gateway: Gateway,
  d: GuildBanAddPayload
) => {
  await gateway.client.users.set(d.user.id, d.user)
  const guild: Guild | undefined = await gateway.client.guilds.get(d.guild_id)
  const user = (await gateway.client.users.get(d.user.id))!

  if (guild !== undefined) {
    // We don't have to delete member, already done with guildMemberRemove event
    gateway.client.emit('guildBanAdd', guild, user)
  }
}
