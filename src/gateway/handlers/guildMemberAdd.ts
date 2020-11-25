import { Gateway, GatewayEventHandler } from '../index.ts'
import { Guild } from '../../structures/guild.ts'

export const guildMemberAdd: GatewayEventHandler = async (
  gateway: Gateway,
  d: 
) => {
  const guild: Guild | undefined = await gateway.client.guilds.get(d.guild_id)
  // Weird case, shouldn't happen
  if (guild === undefined) return

  await guild.members.set(d.id, d)
  const member = await guild.members.get(d.id)
  gateway.client.emit('guildMemberAdd', member)
}