import type { Gateway, GatewayEventHandler } from '../mod.ts'
import { Guild } from '../../structures/guild.ts'
import { GuildMemberChunkPayload } from '../../types/gateway.ts'

export const guildMembersChunk: GatewayEventHandler = async (
  gateway: Gateway,
  d: GuildMemberChunkPayload
) => {
  const guild: Guild | undefined = await gateway.client.guilds.get(d.guild_id)
  // Weird case, shouldn't happen
  if (guild === undefined) return

  for (const member of d.members) {
    await guild.members.set(member.user.id, member)
    await gateway.client.users.set(member.user.id, member.user)
  }

  if (d.presences !== undefined) {
    for (const pres of d.presences) {
      await guild.presences.set(pres.user.id, pres)
    }
  }

  gateway.client.emit('guildMembersChunk', guild, {
    members: d.members.map((m) => m.user.id),
    presences:
      d.presences === undefined ? undefined : d.presences.map((p) => p.user.id),
    chunkIndex: d.chunk_index,
    chunkCount: d.chunk_count
  })

  // Guild is now completely chunked. Emit an event for that.
  if (d.chunk_index >= d.chunk_count - 1) {
    gateway.client.emit('guildMembersChunked', guild, d.chunk_count)
  }
}
