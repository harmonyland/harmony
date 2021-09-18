import type { Message } from '../../structures/message.ts'
import type { GuildTextBasedChannel } from '../../structures/guildTextChannel.ts'
import type { MessageDeleteBulkPayload } from '../../types/gateway.ts'
import { Collection } from '../../utils/collection.ts'
import type { Gateway, GatewayEventHandler } from '../mod.ts'

export const messageDeleteBulk: GatewayEventHandler = async (
  gateway: Gateway,
  d: MessageDeleteBulkPayload
) => {
  const channel = await gateway.client.channels.get<GuildTextBasedChannel>(
    d.channel_id
  )
  // Fetch the channel if not cached
  // if (channel === undefined)
  //   // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
  //   channel = (await gateway.client.channels.fetch(
  //     d.channel_id
  //   )) as GuildTextBasedChannel
  if (channel === undefined) return
  const messages = new Collection<string, Message>()
  const uncached = new Set<string>()
  for (const id of d.ids) {
    const message = await channel.messages.get(id)
    if (message === undefined) uncached.add(id)
    else {
      messages.set(id, message)
      await channel.messages._delete(id)
    }
  }

  gateway.client.emit('messageDeleteBulk', channel, messages, uncached)
}
