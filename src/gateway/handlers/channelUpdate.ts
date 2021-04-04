import type { Channel } from '../../structures/channel.ts'
import type { ChannelPayload } from '../../types/channel.ts'
import type { Gateway, GatewayEventHandler } from '../mod.ts'

export const channelUpdate: GatewayEventHandler = async (
  gateway: Gateway,
  d: ChannelPayload
) => {
  const oldChannel = await gateway.client.channels.get(d.id)
  await gateway.client.channels.set(d.id, d)
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
  const newChannel = (await gateway.client.channels.get(d.id)) as Channel

  if (oldChannel !== undefined) {
    // (DjDeveloperr): Already done by ChannelsManager. I'll recheck later
    // if ('guild_id' in d) {
    //   // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
    //   (newChannel as GuildChannel).guild = await gateway.client.guilds.get((d as GuildChannelPayload).guild_id) as Guild
    // }
    gateway.client.emit('channelUpdate', oldChannel, newChannel)
  } else gateway.client.emit('channelUpdateUncached', newChannel)
}
