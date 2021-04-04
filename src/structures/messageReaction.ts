import { ReactionUsersManager } from '../managers/reactionUsers.ts'
import type { Client } from '../client/mod.ts'
import type { Reaction } from '../types/channel.ts'
import { Base } from './base.ts'
import type { Emoji } from './emoji.ts'
import type { Message } from './message.ts'

export class MessageReaction extends Base {
  message: Message
  count: number = 0
  emoji: Emoji
  me: boolean = false
  users: ReactionUsersManager

  constructor(client: Client, data: Reaction, message: Message, emoji: Emoji) {
    super(client, data)
    this.message = message
    this.emoji = emoji
    this.count = data.count
    this.me = data.me
    this.users = new ReactionUsersManager(client, this)
  }

  fromPayload(data: Reaction): void {
    this.count = data.count
    this.me = data.me
  }
}
