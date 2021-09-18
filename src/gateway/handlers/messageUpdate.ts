import type { Message } from '../../structures/message.ts'
import type { TextChannel } from '../../structures/textChannel.ts'
import type { MessagePayload } from '../../types/channel.ts'
import type { Gateway, GatewayEventHandler } from '../mod.ts'

export const messageUpdate: GatewayEventHandler = async (
  gateway: Gateway,
  d: MessagePayload
) => {
  const channel = await gateway.client.channels.get<TextChannel>(d.channel_id)
  // if (channel === undefined)
  //   channel = await gateway.client.channels.fetch(d.channel_id)

  if (channel === undefined) return

  const message = await channel.messages.get(d.id)
  if (message === undefined) return
  const raw = await channel.messages._get(d.id)
  if (raw === undefined) return

  const newRaw = raw
  Object.assign(newRaw, d)
  await channel.messages.set(d.id, newRaw)

  const newMsg = (await channel.messages.get(d.id)) as unknown as Message
  gateway.client.emit('messageUpdate', message, newMsg)
}
