import { GuildForumTagPayload } from '../../mod.ts'

export class GuildForumTag {
  id!: string
  name!: string
  moderated!: boolean
  emojiID!: string
  emojiName!: string | null

  constructor(data: GuildForumTagPayload) {
    this.readFromData(data)
  }

  readFromData(data: GuildForumTagPayload) {
    this.id = data.id
    this.name = data.name
    this.moderated = data.moderated
    this.emojiID = data.emoji_id
    this.emojiName = data.emoji_name
  }
}
