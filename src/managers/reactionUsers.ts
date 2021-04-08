import type { Client } from '../client/mod.ts'
import type { MessageReaction } from '../structures/messageReaction.ts'
import type { User } from '../structures/user.ts'
import { UsersManager } from './users.ts'

export class ReactionUsersManager extends UsersManager {
  reaction: MessageReaction

  constructor(client: Client, reaction: MessageReaction) {
    super(client)
    this.cacheName = `reaction_users:${reaction.message.id}`
    this.reaction = reaction
  }

  /** Remove all Users from this Reaction */
  async removeAll(): Promise<void> {
    await this.reaction.message.reactions.removeEmoji(this.reaction.emoji)
  }

  /** Remove a specific User from this Reaction */
  async remove(user: User | string): Promise<void> {
    await this.reaction.message.reactions.removeUser(this.reaction.emoji, user)
  }
}
