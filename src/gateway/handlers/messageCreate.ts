import { Channel } from "../../structures/channel.ts"
import { Message } from "../../structures/message.ts"
import { MessageMentions } from "../../structures/MessageMentions.ts"
import { TextChannel } from "../../structures/textChannel.ts"
import { User } from "../../structures/user.ts"
import { MessagePayload } from "../../types/channelTypes.ts"
import { Gateway, GatewayEventHandler } from '../index.ts'

export const messageCreate: GatewayEventHandler = async(
  gateway: Gateway,
  d: MessagePayload
) => {
  let channel = await gateway.client.channels.get(d.channel_id)
  // Fetch the channel if not cached
  if(!channel) channel = (await gateway.client.channels.fetch(d.channel_id) as any) as TextChannel
  let user = new User(gateway.client, d.author)
  await gateway.client.users.set(d.author.id, d.author)
  let mentions = new MessageMentions()
  let message = new Message(gateway.client, d, channel, user, mentions)
  gateway.client.emit('messageCreate', message)
}
