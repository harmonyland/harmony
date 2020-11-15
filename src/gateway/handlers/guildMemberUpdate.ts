import { Gateway, GatewayEventHandler } from '../index.ts'
import { Guild } from '../../structures/guild.ts'

export const guildMemberUpdate: GatewayEventHandler = async (
  gateway: Gateway,
  d: any
) => {
  const guild: Guild | undefined = await gateway.client.guilds.get(d.guild_id)
  // Weird case, shouldn't happen
  if (guild === undefined) return

  const member = await guild.members.get(d.id)
  await guild.members.set(d.id, d)
  const newMember = await guild.members.get(d.id)

  if (member !== undefined) gateway.client.emit('guildMemberRemove', member, newMember)
  else {
      gateway.client.emit('guildMemberUpdateUncached', newMember)
  }
}