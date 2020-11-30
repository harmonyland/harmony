import { Gateway, GatewayEventHandler } from '../index.ts'
import { Guild } from '../../structures/guild.ts'
import { WebhooksUpdatePayload } from "../../types/gateway.ts"
import { GuildTextChannel } from "../../structures/textChannel.ts"

export const webhooksUpdate: GatewayEventHandler = async (
  gateway: Gateway,
  d: WebhooksUpdatePayload
) => {
  const guild: Guild | undefined = await gateway.client.guilds.get(d.guild_id)
  if (guild === undefined) return

  const channel: GuildTextChannel | undefined = await guild.channels.get(d.channel_id) as GuildTextChannel
  if (channel === undefined) gateway.client.emit('webhooksUpdateUncached', guild, d.channel_id)
  else gateway.client.emit('webhooksUpdate', guild, channel)
}