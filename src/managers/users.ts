import type { Client } from '../client/mod.ts'
import { User } from '../structures/user.ts'
import { USER } from '../types/endpoint.ts'
import type { UserPayload } from '../types/user.ts'
import { BaseManager } from './base.ts'

export class UsersManager extends BaseManager<UserPayload, User> {
  constructor(client: Client) {
    super(client, 'users', User)
  }

  async fetch(id: string): Promise<User> {
    return await new Promise((resolve, reject) => {
      this.client.rest
        .get(USER(id))
        .then((data) => {
          this.set(id, data as UserPayload)
          resolve(new User(this.client, data as UserPayload))
        })
        .catch((e) => reject(e))
    })
  }
}
