import type { Gateway, GatewayEventHandler } from '../mod.ts'
import { Guild } from '../../structures/guild.ts'
import { InviteDeletePayload } from '../../types/gateway.ts'
import { PartialInvitePayload } from '../../types/invite.ts'

export const inviteDelete: GatewayEventHandler = async (
  gateway: Gateway,
  d: InviteDeletePayload
) => {
  const guild: Guild | undefined = await gateway.client.guilds.get(d.guild_id ?? "")

  // Hack around <GuildManager>.get that value can be null
  if (guild === undefined) return

  const cachedInvite = await guild.invites.get(d.code)
  const cachedChannel = await gateway.client.channels.get(d.channel_id)
  const cachedGuild = await gateway.client.guilds.get(d.guild_id ?? "")

  // Hack around <ChannelManager>.get that value can be null
  if (cachedChannel === undefined) return

  if (cachedInvite !== undefined) {
    await guild.invites._delete(d.code)
    return gateway.client.emit('inviteDelete', cachedInvite)
  }

  const uncachedInvite: PartialInvitePayload = {
    guild: cachedGuild,
    channel: cachedChannel,
    code: d.code
  }

  gateway.client.emit('inviteDeleteUncached', uncachedInvite)
}
