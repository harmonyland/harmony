import type { Gateway, GatewayEventHandler } from '../mod.ts'
import type { Guild } from '../../structures/guild.ts'
import type { WebhooksUpdatePayload } from '../../types/gateway.ts'
import type { GuildTextBasedChannel } from '../../structures/guildTextChannel.ts'

export const webhooksUpdate: GatewayEventHandler = async (
  gateway: Gateway,
  d: WebhooksUpdatePayload
) => {
  const guild: Guild | undefined = await gateway.client.guilds.get(d.guild_id)
  if (guild === undefined) return

  const channel: GuildTextBasedChannel | undefined = (await guild.channels.get(
    d.channel_id
  )) as GuildTextBasedChannel
  if (channel === undefined)
    gateway.client.emit('webhooksUpdateUncached', guild, d.channel_id)
  else gateway.client.emit('webhooksUpdate', guild, channel)
}
