import { Client } from '../models/client.ts'
import { Guild } from '../structures/guild.ts'
import { Invite } from '../structures/invite.ts'
import { INVITE } from '../types/endpoint.ts'
import { InvitePayload } from '../types/invite.ts'
import { BaseManager } from './base.ts'

export class InviteManager extends BaseManager<InvitePayload, Invite> {
  guild: Guild

  constructor(client: Client, guild: Guild) {
    super(client, `invites:${guild.id}`, Invite)
    this.guild = guild
  }

  async get(key: string): Promise<Invite | undefined> {
    const raw = await this._get(key)
    if (raw === undefined) return
    return new Invite(this.client, raw)
  }

  /** Fetch an Invite */
  async fetch(id: string): Promise<Invite> {
    return await new Promise((resolve, reject) => {
      this.client.rest
        .get(INVITE(id))
        .then(async (data) => {
          this.set(id, data as InvitePayload)
          const newInvite = await this.get(data.code)
          resolve(newInvite as Invite)
        })
        .catch((e) => reject(e))
    })
  }

  async fromPayload(invites: InvitePayload[]): Promise<boolean> {
    for (const invite of invites) {
      await this.set(invite.code, invite)
    }
    return true
  }
}
