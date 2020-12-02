import { TextChannel } from '../../structures/textChannel.ts'
import { MessageDeletePayload } from '../../types/gateway.ts'
import { Gateway, GatewayEventHandler } from '../index.ts'

export const messageDelete: GatewayEventHandler = async (
  gateway: Gateway,
  d: MessageDeletePayload
) => {
  let channel = await gateway.client.channels.get<TextChannel>(d.channel_id)
  // Fetch the channel if not cached
  if (channel === undefined)
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
    channel = (await gateway.client.channels.fetch(d.channel_id)) as TextChannel

  const message = await channel.messages.get(d.id)
  if (message === undefined)
    return gateway.client.emit('messageDeleteUncached', d)
  await channel.messages.delete(d.id)
  gateway.client.emit('messageDelete', message)
}
