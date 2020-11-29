import { Message } from '../../structures/message.ts'
import { TextChannel } from '../../structures/textChannel.ts'
import { User } from '../../structures/user.ts'
import { MessagePayload } from '../../types/channel.ts'
import { Gateway, GatewayEventHandler } from '../index.ts'

export const messageUpdate: GatewayEventHandler = async (
  gateway: Gateway,
  d: MessagePayload
) => {
  let channel = await gateway.client.channels.get<TextChannel>(d.channel_id)
  // Fetch the channel if not cached
  if (channel === undefined)
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
    channel = (await gateway.client.channels.fetch(d.channel_id)) as TextChannel

  const message = await channel.messages.get(d.id)
  const author =
    message?.author !== undefined
      ? message.author
      : new User(gateway.client, d.author)
  const newMsg = new Message(gateway.client, d, channel, author)
  if (message === undefined) {
    await channel.messages.set(d.id, d)
    return gateway.client.emit('messageUpdateUncached', newMsg)
  }
  await channel.messages.set(d.id, d)
  gateway.client.emit('messageUpdate', message, newMsg)
}
