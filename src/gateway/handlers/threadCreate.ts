import type { Gateway, GatewayEventHandler } from '../mod.ts'
import getChannelByType from '../../utils/channel.ts'
import type { ThreadChannelPayload } from '../../types/channel.ts'
import { ThreadChannel } from '../../structures/threadChannel.ts'

export const threadCreate: GatewayEventHandler = async (
  gateway: Gateway,
  d: ThreadChannelPayload
) => {
  const guild = await gateway.client.guilds.get(d.guild_id)
  if (guild === undefined) return
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
  const channel = getChannelByType(gateway.client, d, guild) as ThreadChannel
  if (channel !== undefined) {
    await gateway.client.channels.set(d.id, d)
    gateway.client.emit('threadCreate', channel)
  }
}
