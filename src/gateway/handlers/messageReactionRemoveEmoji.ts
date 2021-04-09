import type { Gateway, GatewayEventHandler } from '../mod.ts'
import type { MessageReactionRemoveEmojiPayload } from '../../types/gateway.ts'
import type { TextChannel } from '../../structures/textChannel.ts'

export const messageReactionRemoveEmoji: GatewayEventHandler = async (
  gateway: Gateway,
  d: MessageReactionRemoveEmojiPayload
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

  const emojiID = (d.emoji.id !== null ? d.emoji.id : d.emoji.name) as string
  const reaction = await message.reactions.get(emojiID)
  if (reaction === undefined) return

  await reaction.users.flush()

  gateway.client.emit('messageReactionRemoveEmoji', message, reaction.emoji)
}
