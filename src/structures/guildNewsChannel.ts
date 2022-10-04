import { Mixin } from '../../deps.ts'
import { GuildTextBasedChannel } from './guildTextChannel.ts'
import { GuildThreadAvailableChannel } from './guildThreadAvailableChannel.ts'

export class NewsChannel extends Mixin(
  GuildTextBasedChannel,
  GuildThreadAvailableChannel
) {}
