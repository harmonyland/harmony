import { Member } from '../../structures/member.ts'
import type { TextChannel } from '../../structures/textChannel.ts'
import type { TypingStartPayload } from '../../types/gateway.ts'
import type { Gateway, GatewayEventHandler } from '../mod.ts'

// TODO: Do we need to add uncached events here?
export const typingStart: GatewayEventHandler = async (
  gateway: Gateway,
  d: TypingStartPayload
) => {
  const user = await gateway.client.users.get(d.user_id)
  if (user === undefined) return

  // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
  const channel = (await gateway.client.channels.get(
    d.channel_id
  )) as TextChannel
  if (channel === undefined) return

  const guild =
    d.guild_id !== undefined
      ? await gateway.client.guilds.get(d.guild_id)
      : undefined
  if (guild === undefined && d.guild_id !== undefined) return

  const member =
    d.member !== undefined && guild !== undefined
      ? new Member(gateway.client, d.member, user, guild)
      : undefined

  gateway.client.emit(
    'typingStart',
    user,
    channel,
    new Date(d.timestamp),
    guild !== undefined && member !== undefined ? { guild, member } : undefined
  )
}
