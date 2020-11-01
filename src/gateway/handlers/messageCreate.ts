import { Channel } from "../../structures/channel.ts"
import { Message } from "../../structures/message.ts"
import { MessagePayload } from "../../types/channelTypes.ts"
import { Gateway, GatewayEventHandler } from '../index.ts'

export const messageCreate: GatewayEventHandler = async(
  gateway: Gateway,
  d: MessagePayload
) => {
  let channel = gateway.client.channels.get(d.channel_id)
  // Fetch the channel if not cached
  if(!channel) channel = (await gateway.client.channels.fetch(d.channel_id) as any) as Channel
  let message = new Message(gateway.client, d, channel)
  gateway.client.emit('messageCreate', message)
}
