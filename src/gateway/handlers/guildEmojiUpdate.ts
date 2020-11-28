import { Emoji } from "../../structures/emoji.ts"
import { Guild } from '../../structures/guild.ts'
import { EmojiPayload } from "../../types/emoji.ts"
import { GuildEmojiUpdatePayload } from '../../types/gateway.ts'
import { Gateway, GatewayEventHandler } from '../index.ts'

export const guildEmojiUpdate: GatewayEventHandler = async (
  gateway: Gateway,
  d: GuildEmojiUpdatePayload
) => {
  const guild: Guild | undefined = await gateway.client.guilds.get(d.guild_id)
  if (guild !== undefined) {
    const emojis = await guild.emojis.collection()
    const deleted: Emoji[] = []
    const added: Emoji[] = []
    const updated: Array<{ before: Emoji, after: Emoji }> = []
    const _updated: EmojiPayload[] = []

    for (const raw of d.emojis) {
      const has = emojis.get(raw.id)
      if (has === undefined) {
        await guild.emojis.set(raw.id, raw)
        const emoji = await guild.emojis.get(raw.id) as Emoji
        added.push(emoji)
      } else _updated.push(raw)
    }

    for (const emoji of emojis.values()) {
      const find = _updated.find(e => emoji.id === e.id)
      if (find === undefined) {
        await guild.emojis.delete(emoji.id)
        deleted.push(emoji)
      } else {
        const before = await guild.emojis.get(find.id) as Emoji
        await guild.emojis.set(find.id, find)
        const after = await guild.emojis.get(find.id) as Emoji
        updated.push({ before, after })
      }
    }

    for (const emoji of deleted) {
      gateway.client.emit('guildEmojiDelete', guild, emoji)
    }

    for (const emoji of added) {
      gateway.client.emit('guildEmojiAdd', guild, emoji)
    }

    for (const emoji of updated) {
      gateway.client.emit('guildEmojiUpdate', guild, emoji.before, emoji.after)
    }
  }
}
