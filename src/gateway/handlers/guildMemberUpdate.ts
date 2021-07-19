import type { Gateway, GatewayEventHandler } from '../mod.ts'
import { GuildMemberUpdatePayload } from '../../types/gateway.ts'
import { MemberPayload } from '../../types/guild.ts'

export const guildMemberUpdate: GatewayEventHandler = async (
  gateway: Gateway,
  d: GuildMemberUpdatePayload
) => {
  const guild = await gateway.client.guilds.get(d.guild_id)
  // Weird case, shouldn't happen
  if (guild === undefined) return

  await gateway.client.users.set(d.user.id, d.user)
  const member = await guild.members.get(d.user.id)
  const newMemberPayload: MemberPayload = {
    user: d.user,
    roles: d.roles,
    'joined_at': d.joined_at,
    nick: d.nick,
    'premium_since': d.premium_since,
    deaf: member?.deaf ?? false,
    mute: member?.mute ?? false
  }
  await guild.members.set(d.user.id, newMemberPayload)
  const newMember = await guild.members.get(d.user.id)

  if (member !== undefined)
    gateway.client.emit('guildMemberUpdate', member, newMember)
  else {
    gateway.client.emit('guildMemberUpdateUncached', newMember)
  }
}
