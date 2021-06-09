import type { Gateway, GatewayEventHandler } from '../mod.ts'
import { Guild } from '../../structures/guild.ts'
import { GuildBanRemovePayload } from '../../types/gateway.ts'

export const guildBanRemove: GatewayEventHandler = async (
  gateway: Gateway,
  d: GuildBanRemovePayload
) => {
  const guild: Guild | undefined = await gateway.client.guilds.get(d.guild_id)
  await gateway.client.users.set(d.user.id, d.user)
  const user = (await gateway.client.users.get(d.user.id))!

  if (guild !== undefined) {
    gateway.client.emit('guildBanRemove', guild, user)
  }
}
