import type { Gateway, GatewayEventHandler } from '../mod.ts'
import type { ChannelTypes } from '../../types/channel.ts'

export const threadDelete: GatewayEventHandler = async (
  gateway: Gateway,
  d: { id: string; guild_id: string; parent_id: string; type: ChannelTypes }
) => {
  const guild = await gateway.client.guilds.get(d.guild_id)
  if (guild === undefined) return
  const old = await guild.threads.get(d.id)
  await guild.threads.delete(d.id)

  if (old === undefined) {
    gateway.client.emit('threadDeleteUncached', d.id)
  } else {
    gateway.client.emit('threadDelete', old)
  }
}
