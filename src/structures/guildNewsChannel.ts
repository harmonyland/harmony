import { Mixin } from '../../deps.ts'
import type { GuildNewsChannelPayload } from '../types/channel.ts'
import type { Client } from '../client/mod.ts'
import type { Guild } from './guild.ts'
import { GuildTextBasedChannel } from './guildTextChannel.ts'
import { GuildThreadAvailableChannel } from './guildThreadAvailableChannel.ts'

const NewsChannelSuper: (abstract new (
  client: Client,
  data: GuildNewsChannelPayload,
  guild: Guild
) => GuildTextBasedChannel & GuildThreadAvailableChannel) &
  Pick<typeof GuildTextBasedChannel, keyof typeof GuildTextBasedChannel> &
  Pick<
    typeof GuildThreadAvailableChannel,
    keyof typeof GuildThreadAvailableChannel
  > = Mixin(GuildTextBasedChannel, GuildThreadAvailableChannel)

export class NewsChannel extends NewsChannelSuper {}
