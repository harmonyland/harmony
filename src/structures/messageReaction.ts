import { ReactionUsersManager } from '../managers/reactionUsers.ts'
import { Client } from '../models/client.ts'
import { Reaction } from '../types/channel.ts'
import { Base } from './base.ts'
import { Emoji } from './emoji.ts'
import { Message } from './message.ts'

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
