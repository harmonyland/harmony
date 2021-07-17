import type { GuildTextChannel, User } from '../../mod.ts'
import type { Client } from '../client/mod.ts'
import type { Guild } from '../structures/guild.ts'
import { Invite } from '../structures/invite.ts'
import { CHANNEL_INVITES, GUILD_INVITES, INVITE } from '../types/endpoint.ts'
import type { InvitePayload } from '../types/invite.ts'
import { BaseManager } from './base.ts'

export enum InviteTargetUserType {
  STREAM = 1
}

export interface CreateInviteOptions {
  maxAge?: number
  maxUses?: number
  temporary?: boolean
  unique?: boolean
  targetUser?: string | User
  targetUserType?: InviteTargetUserType
}

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
  async fetch(id: string, withCounts: boolean = true): Promise<Invite> {
    return await new Promise((resolve, reject) => {
      this.client.rest
        .get(`${INVITE(id)}${withCounts ? '?with_counts=true' : ''}`)
        .then(async (data) => {
          this.set(id, data as InvitePayload)
          const newInvite = await this.get(data.code)
          resolve(newInvite as Invite)
        })
        .catch((e) => reject(e))
    })
  }

  /** Fetch all Invites of a Guild or a specific Channel */
  async fetchAll(channel?: string | GuildTextChannel): Promise<Invite[]> {
    const rawInvites = (await this.client.rest.get(
      channel === undefined
        ? GUILD_INVITES(this.guild.id)
        : CHANNEL_INVITES(typeof channel === 'string' ? channel : channel.id)
    )) as InvitePayload[]

    const res: Invite[] = []

    for (const raw of rawInvites) {
      await this.set(raw.code, raw)
      res.push(new Invite(this.client, raw))
    }

    return res
  }

  /** Delete an Invite */
  async delete(invite: string | Invite): Promise<boolean> {
    await this.client.rest.delete(
      INVITE(typeof invite === 'string' ? invite : invite.code)
    )
    return true
  }

  /** Create an Invite */
  async create(
    channel: string | GuildTextChannel,
    options?: CreateInviteOptions
  ): Promise<Invite> {
    const raw = (await this.client.rest.post(
      CHANNEL_INVITES(typeof channel === 'string' ? channel : channel.id),
      {
        max_age: options?.maxAge,
        max_uses: options?.maxUses,
        temporary: options?.temporary,
        unique: options?.unique,
        target_user:
          options?.targetUser === undefined
            ? undefined
            : typeof options.targetUser === 'string'
            ? options.targetUser
            : options.targetUser.id,
        target_user_type: options?.targetUserType
      }
    )) as unknown as InvitePayload

    return new Invite(this.client, raw)
  }

  async fromPayload(invites: InvitePayload[]): Promise<boolean> {
    for (const invite of invites) {
      await this.set(invite.code, invite)
    }
    return true
  }
}
