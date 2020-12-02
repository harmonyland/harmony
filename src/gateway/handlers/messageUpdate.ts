import { Message } from '../../structures/message.ts'
import { TextChannel } from '../../structures/textChannel.ts'
import { MessagePayload } from '../../types/channel.ts'
import { Gateway, GatewayEventHandler } from '../index.ts'

export const messageUpdate: GatewayEventHandler = async (
  gateway: Gateway,
  d: MessagePayload
) => {
  let channel = await gateway.client.channels.get<TextChannel>(d.channel_id)
  // Fetch the channel if not cached
  if (channel === undefined)
    channel = await gateway.client.channels.fetch(d.channel_id)

  if (channel === undefined) return

  const message = await channel.messages.get(d.id)
  if (message === undefined) return
  const raw = await channel.messages._get(d.id)
  if (raw === undefined) return

  const newRaw = raw
  Object.assign(newRaw, d)
  await channel.messages.set(d.id, newRaw)

  const newMsg = ((await channel.messages.get(d.id)) as unknown) as Message
  gateway.client.emit('messageUpdate', message, newMsg)
}
