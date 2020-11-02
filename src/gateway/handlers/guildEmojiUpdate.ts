import cache from '../../models/cache.ts'
import { Guild } from '../../structures/guild.ts'
import { GuildEmojiUpdatePayload } from '../../types/gatewayTypes.ts'
import { Gateway, GatewayEventHandler } from '../index.ts'

const guildEmojiUpdate: GatewayEventHandler = (
  gateway: Gateway,
  d: GuildEmojiUpdatePayload
) => {
  const guild: Guild = cache.get('guild', d.guild_id)
  if (guild !== undefined) {
    const emojis = guild.emojis
  }
}
