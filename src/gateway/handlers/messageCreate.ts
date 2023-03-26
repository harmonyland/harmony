import { Message } from '../../structures/message.ts'
import type { TextChannel } from '../../structures/textChannel.ts'
import { User } from '../../structures/user.ts'
import type { MessagePayload } from '../../types/channel.ts'
import type { Gateway, GatewayEventHandler } from '../mod.ts'

export const messageCreate: GatewayEventHandler = async (
  gateway: Gateway,
  d: MessagePayload
) => {
  let channel = await gateway.client.channels.get<TextChannel>(d.channel_id)
  // Fetch the channel if not cached.
  // Commented out right now as it causes some undefined behavior.
  // if (channel === undefined)
  //   // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
  //   channel = (await gateway.client.channels.fetch(d.channel_id)) as TextChannel
  if (channel === undefined) {
    if (d.guild_id === undefined) {
      // Let's assume it's a DM channel.
      await gateway.client.channels.set(d.channel_id, {
        id: d.channel_id,
        type: 1,
        flags: 0
      })
      channel = (await gateway.client.channels.get<TextChannel>(d.channel_id))!
    } else return
  }
  await channel.messages.set(d.id, d)
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
  const message = new Message(gateway.client, d, channel, user)
  if (guild !== undefined) message.guild = guild
  await message.mentions.fromPayload(d)
  message.member = member
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
