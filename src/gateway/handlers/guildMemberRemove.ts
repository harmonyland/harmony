import type { Gateway, GatewayEventHandler } from '../mod.ts'
import { Guild } from '../../structures/guild.ts'
import { User } from '../../structures/user.ts'
import { GuildMemberRemovePayload } from '../../types/gateway.ts'

export const guildMemberRemove: GatewayEventHandler = async (
  gateway: Gateway,
  d: GuildMemberRemovePayload
) => {
  const guild: Guild | undefined = await gateway.client.guilds.get(d.guild_id)
  // Weird case, shouldn't happen
  if (guild === undefined) return

  await gateway.client.users.set(d.user.id, d.user)
  const member = await guild.members.get(d.user.id)
  await guild.members._delete(d.user.id)

  if (member !== undefined) gateway.client.emit('guildMemberRemove', member)
  else {
    const user = new User(gateway.client, d.user)
    gateway.client.emit('guildMemberRemoveUncached', user)
  }
}
