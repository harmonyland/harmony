import type { Gateway, GatewayEventHandler } from '../mod.ts'
import type {
  ThreadChannelPayload,
  ThreadMemberPayload
} from '../../types/channel.ts'
import { ThreadChannel, ThreadMember } from '../../structures/threadChannel.ts'
import { Collection } from '../../utils/collection.ts'
import { GuildTextBasedChannel } from '../../structures/guildTextChannel.ts'

export const threadListSync: GatewayEventHandler = async (
  gateway: Gateway,
  d: {
    guild_id: string
    channel_ids?: string[]
    threads: ThreadChannelPayload[]
    members: ThreadMemberPayload[]
  }
) => {
  const guild = await gateway.client.guilds.get(d.guild_id)
  if (guild === undefined) return

  const threads = new Collection<string, ThreadChannel>()
  const members = new Collection<string, ThreadMember>()

  for (const data of d.threads) {
    await guild.threads.set(data.id, data)
    threads.set(data.id, (await guild.threads.get(data.id))!)
  }

  for (const data of d.members) {
    const thread =
      threads.find((e) => e.id === data.id) ??
      (await guild.threads.get(data.id))
    if (thread !== undefined) {
      await thread.members.set(data.id, data)
      members.set(data.id, (await thread.members.get(data.id))!)
    }
  }

  const channels = new Collection<string, GuildTextBasedChannel>()

  for (const id of d.channel_ids ?? []) {
    const chan = await guild.channels.get(id)
    if (chan !== undefined) {
      channels.set(id, (chan as unknown) as GuildTextBasedChannel)
    }
  }

  gateway.client.emit('threadListSync', guild, threads, members, channels)
}
