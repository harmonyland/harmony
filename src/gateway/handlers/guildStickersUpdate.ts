import { Guild } from '../../structures/guild.ts'
import { MessageSticker } from '../../structures/messageSticker.ts'
import { MessageStickerPayload } from '../../types/channel.ts'
import type { Gateway, GatewayEventHandler } from '../mod.ts'

export const guildStickersUpdate: GatewayEventHandler = async (
  gateway: Gateway,
  d: { guild_id: string; stickers: MessageStickerPayload[] }
) => {
  const guild: Guild | undefined = await gateway.client.guilds.get(d.guild_id)
  if (guild !== undefined) {
    const stickers = await guild.stickers.collection()
    const deleted: MessageSticker[] = []
    const added: MessageSticker[] = []
    const updated: Array<{ before: MessageSticker; after: MessageSticker }> = []
    const _updated: MessageStickerPayload[] = []

    for (const raw of d.stickers) {
      if (raw.user !== undefined)
        await gateway.client.users.set(raw.user.id, raw.user)
      const stickerID = (raw.id !== null ? raw.id : raw.name) as string
      const has = stickers.get(stickerID)
      if (has === undefined) {
        await guild.stickers.set(stickerID, raw)
        const sticker = (await guild.stickers.get(stickerID)) as MessageSticker
        added.push(sticker)
      } else _updated.push(raw)
    }

    for (const sticker of stickers.values()) {
      const stickerID = (
        sticker.id !== null ? sticker.id : sticker.name
      ) as string
      const find = _updated.find((e) => {
        const eID = e.id !== null ? e.id : e.name
        return stickerID === eID
      })
      if (find === undefined) {
        await guild.stickers.delete(stickerID)
        deleted.push(sticker)
      } else {
        const foundID = (find.id !== null ? find.id : find.name) as string
        const before = (await guild.stickers.get(foundID)) as MessageSticker
        await guild.stickers.set(foundID, find)
        const after = (await guild.stickers.get(foundID)) as MessageSticker
        updated.push({ before, after })
      }
    }

    gateway.client.emit('guildStickersUpdate', guild)

    for (const sticker of deleted) {
      gateway.client.emit('guildStickerDelete', sticker)
    }

    for (const sticker of added) {
      gateway.client.emit('guildStickerAdd', sticker)
    }

    for (const sticker of updated) {
      gateway.client.emit('guildStickerUpdate', sticker.before, sticker.after)
    }
  }
}
