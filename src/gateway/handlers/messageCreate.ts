import { Message } from '../../structures/message.ts'
import { MessageMentions } from '../../structures/messageMentions.ts'
import { TextChannel } from '../../structures/textChannel.ts'
import { User } from '../../structures/user.ts'
import { MessagePayload } from '../../types/channel.ts'
import { Gateway, GatewayEventHandler } from '../index.ts'

export const messageCreate: GatewayEventHandler = async (
  gateway: Gateway,
  d: MessagePayload
) => {
  let channel = await gateway.client.channels.get<TextChannel>(d.channel_id)
  // Fetch the channel if not cached
  if (channel === undefined)
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
    channel = (await gateway.client.channels.fetch(d.channel_id)) as TextChannel
  const user = new User(gateway.client, d.author)
  await gateway.client.users.set(d.author.id, d.author)
  let guild
  let member
  if (d.guild_id !== undefined) {
    guild = await gateway.client.guilds.get(d.guild_id)
  }
  if (guild !== undefined && d.member !== undefined) {
    d.member.user = d.author
    await guild.members.set(d.author.id, d.member)
    member = await guild.members.get(d.author.id)
  }
  const mentions = new MessageMentions()
  const message = new Message(gateway.client, d, channel as any, user, mentions)
  message.member = member
  if (guild !== undefined) message.guild = guild
  if (message.member !== undefined) {
    if (message.member.user === undefined) {
      const user = await gateway.client.users.get(message.member.id)
      if (user !== undefined) {
        message.member.user = user
      }
    }
  }
  gateway.client.emit('messageCreate', message)
}
