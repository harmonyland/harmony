import type { Gateway, GatewayEventHandler } from '../mod.ts'
import { Guild } from '../../structures/guild.ts'
import { InviteDeletePayload } from '../../types/gateway.ts'
import { PartialInvitePayload } from '../../types/invite.ts'
import { Channel } from '../../structures/channel.ts'

export const inviteDelete: GatewayEventHandler = async (
  gateway: Gateway,
  d: InviteDeletePayload
) => {
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const guild: Guild | undefined = await gateway.client.guilds.get(d.guild_id!)

  // Weird case, shouldn't happen
  if (guild === undefined) return

  const cachedInvite = await guild.invites.get(d.code)
  const cachedChannel = await gateway.client.channels.get(d.channel_id)
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const cachedGuild = await gateway.client.guilds.get(d.guild_id!)

  if (cachedInvite === undefined) {
    const uncachedInvite: PartialInvitePayload = {
      guild: cachedGuild as unknown as Guild,
      channel: cachedChannel as unknown as Channel,
      code: d.code
    }
    return gateway.client.emit('inviteDeleteUncached', uncachedInvite)
  } else {
    await guild.invites._delete(d.code)
    gateway.client.emit('inviteDelete', cachedInvite)
  }
}
