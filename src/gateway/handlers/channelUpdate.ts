import { Channel } from '../../structures/channel.ts'
import { Guild } from "../../structures/guild.ts"
import { ChannelPayload, GuildChannelPayload } from '../../types/channel.ts'
import getChannelByType from '../../utils/getChannelByType.ts'
import { Gateway, GatewayEventHandler } from '../index.ts'

export const channelUpdate: GatewayEventHandler = async (
  gateway: Gateway,
  d: ChannelPayload
) => {
  const oldChannel: Channel | undefined = await gateway.client.channels.get(d.id)

  if (oldChannel !== undefined) {
    await gateway.client.channels.set(d.id, d)
    let guild: undefined | Guild;
    if ('guild_id' in d) {
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
      guild = await gateway.client.guilds.get((d as GuildChannelPayload).guild_id) as Guild | undefined
    }
    if (oldChannel.type !== d.type) {
      const channel: Channel = getChannelByType(gateway.client, d, guild) ?? oldChannel
      gateway.client.emit('channelUpdate', oldChannel, channel)
    } else {
      const before = oldChannel.refreshFromData(d)
      gateway.client.emit('channelUpdate', before, oldChannel)
    }
  }
}
