import type { Gateway, GatewayEventHandler } from '../mod.ts'
import type { MessageReactionAddPayload } from '../../types/gateway.ts'
import type { TextChannel } from '../../structures/textChannel.ts'
import type { MessageReaction } from '../../structures/messageReaction.ts'
import type { UserPayload } from '../../types/user.ts'

export const messageReactionAdd: GatewayEventHandler = async (
  gateway: Gateway,
  d: MessageReactionAddPayload
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
  let reaction = await message.reactions.get(emojiID)
  if (reaction === undefined) {
    await message.reactions.set(emojiID, {
      count: 1,
      emoji: d.emoji,
      me: d.user_id === gateway.client.user?.id
    })
    reaction = (await message.reactions.get(
      emojiID
    )) as unknown as MessageReaction
  }

  const rawUser = (await gateway.client.users.get(
    d.user_id
  )) as unknown as UserPayload

  reaction.users.set(rawUser.id, rawUser)

  gateway.client.emit('messageReactionAdd', reaction, user)
}
