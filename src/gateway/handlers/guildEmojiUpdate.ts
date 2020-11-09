import cache from '../../models/cache.ts'
import { Guild } from '../../structures/guild.ts'
import { GuildEmojiUpdatePayload } from '../../types/gateway.ts'
import { Gateway, GatewayEventHandler } from '../index.ts'

export const guildEmojiUpdate: GatewayEventHandler = (
  gateway: Gateway,
  d: GuildEmojiUpdatePayload
) => {
  const guild: Guild = cache.get('guild', d.guild_id)
  if (guild !== undefined) {
    // const emojis = guild.emojis
  }
}
