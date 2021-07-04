import type { Gateway, GatewayEventHandler } from '../mod.ts'
import type { ThreadMemberPayload } from '../../types/channel.ts'
import { Collection } from '../../utils/collection.ts'
import { ThreadMember } from '../../structures/threadChannel.ts'

export const threadMembersUpdate: GatewayEventHandler = async (
  gateway: Gateway,
  d: {
    id: string
    guild_id: string
    member_count: number
    added_members?: ThreadMemberPayload[]
    removed_member_ids?: string[]
  }
) => {
  const guild = await gateway.client.guilds.get(d.guild_id)
  if (guild === undefined) return
  const thread = await guild.threads.get(d.id)
  if (thread === undefined) return

  const added = new Collection<string, ThreadMember>()
  const removed = new Collection<string, ThreadMember | undefined>()

  for (const data of d.added_members ?? []) {
    await thread.members.set(data.id, data)
    added.set(data.id, (await thread.members.get(data.id))!)
  }

  for (const id of d.removed_member_ids ?? []) {
    const member = await thread.members.get(id)
    removed.set(id, member)
  }

  gateway.client.emit(
    'threadMembersUpdate',
    guild,
    added,
    removed,
    d.member_count
  )
}
