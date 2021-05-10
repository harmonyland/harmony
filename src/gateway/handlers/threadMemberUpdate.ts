import type { Gateway, GatewayEventHandler } from '../mod.ts'
import type { ThreadMemberPayload } from '../../types/channel.ts'
import { ThreadChannel } from '../../structures/threadChannel.ts'

export const threadMemberUpdate: GatewayEventHandler = async (
  gateway: Gateway,
  d: ThreadMemberPayload
) => {
  const thread = await gateway.client.channels.get<ThreadChannel>(d.id)
  if (thread === undefined) return
  await thread.members.set(d.user_id, d)
  gateway.client.emit(
    'threadMemberUpdate',
    (await thread.members.get(d.user_id))!
  )
}
