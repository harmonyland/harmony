import { Gateway, GatewayEventHandler } from '../index.ts'
import { MessageReactionRemovePayload } from '../../types/gateway.ts'
import { TextChannel } from '../../structures/textChannel.ts'

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

  const reaction = await message.reactions.get(d.emoji.id)
  if (reaction === undefined) return

  reaction.users.delete(d.user_id)

  gateway.client.emit('messageReactionRemove', reaction, user)
}
