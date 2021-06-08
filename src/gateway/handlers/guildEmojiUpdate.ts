import { Emoji } from '../../structures/emoji.ts'
import { Guild } from '../../structures/guild.ts'
import { EmojiPayload } from '../../types/emoji.ts'
import { GuildEmojiUpdatePayload } from '../../types/gateway.ts'
import type { Gateway, GatewayEventHandler } from '../mod.ts'

export const guildEmojiUpdate: GatewayEventHandler = async (
  gateway: Gateway,
  d: GuildEmojiUpdatePayload
) => {
  const guild: Guild | undefined = await gateway.client.guilds.get(d.guild_id)
  if (guild !== undefined) {
    const emojis = await guild.emojis.collection()
    const deleted: Emoji[] = []
    const added: Emoji[] = []
    const updated: Array<{ before: Emoji; after: Emoji }> = []
    const _updated: EmojiPayload[] = []

    for (const raw of d.emojis) {
      if (raw.user !== undefined)
        await gateway.client.users.set(raw.user.id, raw.user)
      const emojiID = (raw.id !== null ? raw.id : raw.name) as string
      const has = emojis.get(emojiID)
      if (has === undefined) {
        await guild.emojis.set(emojiID, raw)
        const emoji = (await guild.emojis.get(emojiID)) as Emoji
        added.push(emoji)
      } else _updated.push(raw)
    }

    for (const emoji of emojis.values()) {
      const emojiID = (emoji.id !== null ? emoji.id : emoji.name) as string
      const find = _updated.find((e) => {
        const eID = e.id !== null ? e.id : e.name
        return emojiID === eID
      })
      if (find === undefined) {
        await guild.emojis.delete(emojiID)
        deleted.push(emoji)
      } else {
        const foundID = (find.id !== null ? find.id : find.name) as string
        const before = (await guild.emojis.get(foundID)) as Emoji
        await guild.emojis.set(foundID, find)
        const after = (await guild.emojis.get(foundID)) as Emoji
        updated.push({ before, after })
      }
    }

    gateway.client.emit('guildEmojisUpdate', guild)

    for (const emoji of deleted) {
      gateway.client.emit('guildEmojiDelete', emoji)
    }

    for (const emoji of added) {
      gateway.client.emit('guildEmojiAdd', emoji)
    }

    for (const emoji of updated) {
      gateway.client.emit('guildEmojiUpdate', emoji.before, emoji.after)
    }
  }
}
