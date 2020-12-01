import { Gateway, GatewayEventHandler } from '../index.ts'
import { Guild } from '../../structures/guild.ts'
import { GuildMemberAddPayload } from '../../../mod.ts'

export const guildMemberAdd: GatewayEventHandler = async (
  gateway: Gateway,
  d: GuildMemberAddPayload
) => {
  const guild: Guild | undefined = await gateway.client.guilds.get(d.guild_id)
  // Weird case, shouldn't happen
  if (guild === undefined) return

  await guild.members.set(d.user.id, d)
  const member = await guild.members.get(d.user.id)
  gateway.client.emit('guildMemberAdd', member)
}
