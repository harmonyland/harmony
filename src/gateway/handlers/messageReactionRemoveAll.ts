import type { Gateway, GatewayEventHandler } from '../mod.ts'
import type { MessageReactionRemoveAllPayload } from '../../types/gateway.ts'
import type { TextChannel } from '../../structures/textChannel.ts'

export const messageReactionRemoveAll: GatewayEventHandler = async (
  gateway: Gateway,
  d: MessageReactionRemoveAllPayload
) => {
  let channel = await gateway.client.channels.get<TextChannel>(d.channel_id)
  if (channel === undefined)
    channel = await gateway.client.channels.fetch<TextChannel>(d.channel_id)
  if (channel === undefined) return

  let message = await channel.messages.get(d.message_id)
  if (message === undefined) {
    if (gateway.client.fetchUncachedReactions === true) {
      message = await channel.messages.fetch(d.message_id)
      if (message === undefined) return
    } else return
  }

  await message.reactions.flush()

  gateway.client.emit('messageReactionRemoveAll', message)
}
