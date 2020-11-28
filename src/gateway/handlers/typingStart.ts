import { Member } from "../../structures/member.ts"
import { TextChannel } from "../../structures/textChannel.ts"
import { TypingStartPayload } from "../../types/gateway.ts"
import { Gateway, GatewayEventHandler } from '../index.ts'

// TODO: Do we need to add uncached events here?
export const typingStart: GatewayEventHandler = async (
  gateway: Gateway,
  d: TypingStartPayload
) => {
  const user = await gateway.client.users.get(d.user_id)
  if (user === undefined) return console.log('user not cached')

  const channel = await gateway.client.channels.get(d.channel_id)
  if (channel === undefined) return console.log(`channel not cached`)

  const guild = d.guild_id !== undefined ? await gateway.client.guilds.get(d.guild_id) : undefined
  if(guild === undefined && d.guild_id !== undefined) return console.log('guild not cached')

  const member = d.member !== undefined && guild !== undefined ? new Member(gateway.client, d.member, user, guild) : undefined

  gateway.client.emit('typingStart', user, (channel as unknown) as TextChannel, new Date(d.timestamp), guild !== undefined && member !== undefined ? { guild, member } : undefined)
}
