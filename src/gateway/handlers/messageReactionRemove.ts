import type { Gateway, GatewayEventHandler } from '../mod.ts'
import type { MessageReactionRemovePayload } from '../../types/gateway.ts'
import type { TextChannel } from '../../structures/textChannel.ts'

export const messageReactionRemove: GatewayEventHandler = async (
  gateway: Gateway,
  d: MessageReactionRemovePayload
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

  let user = await gateway.client.users.get(d.user_id)
  if (user === undefined) {
    if (gateway.client.fetchUncachedReactions === true) {
      user = await gateway.client.users.fetch(d.user_id)
      if (user === undefined) return
    } else return
  }

  const emojiID = (d.emoji.id !== null ? d.emoji.id : d.emoji.name) as string
  const reaction = await message.reactions.get(emojiID)
  if (reaction === undefined) return

  reaction.users._delete(d.user_id)

  gateway.client.emit('messageReactionRemove', reaction, user)
}
