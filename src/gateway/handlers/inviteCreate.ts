import type { Gateway, GatewayEventHandler } from '../mod.ts'
import { InviteCreatePayload } from '../../types/gateway.ts'
import { InvitePayload } from '../../types/invite.ts'

export const inviteCreate: GatewayEventHandler = async (
  gateway: Gateway,
  d: InviteCreatePayload
) => {
  const guild = await gateway.client.guilds.get(d.guild_id!)

  // Weird case, shouldn't happen
  if (guild === undefined) return

  /**
   * TODO(DjDeveloperr): Add _get method in BaseChildManager
   */
  const cachedChannel = await gateway.client.channels._get(d.channel_id)

  const cachedGuild = d.guild_id === undefined ? undefined : await guild.client.guilds._get(d.guild_id)

  const dataConverted: InvitePayload = {
    code: d.code,
    guild: cachedGuild,
    // had to use `as ChannelPayload` because the _get method returned `ChannelPayload | undefined` which errored
    channel: cachedChannel!,
    inviter: d.inviter,
    'target_user': d.target_user,
    'target_user_type': d.target_user_type
  }

  await guild.invites.set(d.code, dataConverted)
  const invite = await guild.invites.get(d.code)
  gateway.client.emit('inviteCreate', invite!)
}
