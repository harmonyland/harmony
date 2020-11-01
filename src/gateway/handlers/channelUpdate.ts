import { Channel } from '../../structures/channel.ts'
import { Guild } from "../../structures/guild.ts"
import getChannelByType from '../../utils/getChannelByType.ts'
import { Gateway, GatewayEventHandler } from '../index.ts'

export const channelUpdate: GatewayEventHandler = async (
  gateway: Gateway,
  d: any
) => {
  const oldChannel: Channel = await gateway.client.channels.get(d.id)

  if (oldChannel !== undefined) {
    await gateway.client.channels.set(d.id, d)
    let guild: undefined | Guild;
    if(d.guild_id) {
      guild = await gateway.client.guilds.get(d.guild_id) || undefined
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
