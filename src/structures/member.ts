import { MemberRolesManager } from '../managers/memberRoles.ts'
import { Client } from '../models/client.ts'
import { GUILD_MEMBER } from '../types/endpoint.ts'
import { MemberPayload } from '../types/guild.ts'
import { Permissions } from '../utils/permissions.ts'
import { Base } from './base.ts'
import { Guild } from './guild.ts'
import { Role } from './role.ts'
import { User } from './user.ts'

export interface MemberData {
  nick?: string | null
  roles?: Array<Role | string>
  deaf?: boolean
  mute?: boolean
}

export class Member extends Base {
  id: string
  user: User
  nick?: string
  roles: MemberRolesManager
  joinedAt: string
  premiumSince?: string
  deaf: boolean
  mute: boolean
  guild: Guild
  permissions: Permissions

  constructor(
    client: Client,
    data: MemberPayload,
    user: User,
    guild: Guild,
    perms?: Permissions
  ) {
    super(client)
    this.id = data.user.id
    this.user = user
    this.nick = data.nick
    this.guild = guild
    this.roles = new MemberRolesManager(this.client, this.guild.roles, this)
    this.joinedAt = data.joined_at
    this.premiumSince = data.premium_since
    this.deaf = data.deaf
    this.mute = data.mute
    if (perms !== undefined) this.permissions = perms
    else this.permissions = new Permissions(Permissions.DEFAULT)
  }

  get displayName(): string {
    return this.nick !== undefined ? this.nick : this.user.username
  }

  toString(): string {
    return this.user.nickMention
  }

  readFromData(data: MemberPayload): void {
    this.nick = data.nick ?? this.nick
    this.joinedAt = data.joined_at ?? this.joinedAt
    this.premiumSince = data.premium_since ?? this.premiumSince
    this.deaf = data.deaf ?? this.deaf
    this.mute = data.mute ?? this.mute
  }

  /**
   * Updates the Member data in cache (and this object).
   */
  async fetch(): Promise<Member> {
    const raw = await this.client.rest.get(this.id)
    if (typeof raw !== 'object') throw new Error('Member not found')
    await this.guild.members.set(this.id, raw)
    this.readFromData(raw)
    return this
  }

  /**
   * Edits the Member
   * @param data Data to apply
   */
  async edit(data: MemberData): Promise<Member> {
    const payload = {
      nick: data.nick,
      roles: data.roles?.map((e) => (typeof e === 'string' ? e : e.id)),
      deaf: data.deaf,
      mute: data.mute
    }
    const res = await this.client.rest.patch(
      GUILD_MEMBER(this.guild.id, this.id),
      payload,
      undefined,
      null,
      true
    )
    if (res.ok === true) {
      if (data.nick !== undefined)
        this.nick = data.nick === null ? undefined : data.nick
      if (data.deaf !== undefined) this.deaf = data.deaf
      if (data.mute !== undefined) this.mute = data.mute
    }
    return this
  }

  /**
   * New nickname to set. If empty, nick is reset
   * @param nick New nickname
   */
  async setNickname(nick?: string): Promise<Member> {
    return await this.edit({
      nick: nick === undefined ? null : nick
    })
  }

  /**
   * Resets nickname of the Member
   */
  async resetNickname(): Promise<Member> {
    return await this.setNickname()
  }

  /**
   * Sets a Member mute in VC
   * @param mute Value to set
   */
  async setMute(mute?: boolean): Promise<Member> {
    return await this.edit({
      mute: mute === undefined ? false : mute
    })
  }

  /**
   * Sets a Member deaf in VC
   * @param deaf Value to set
   */
  async setDeaf(deaf?: boolean): Promise<Member> {
    return await this.edit({
      deaf: deaf === undefined ? false : deaf
    })
  }

  /**
   * Unmutes the Member from VC.
   */
  async unmute(): Promise<Member> {
    return await this.setMute(false)
  }

  /**
   * Kicks the member.
   */
  async kick(): Promise<boolean> {
    const resp = await this.client.rest.delete(
      GUILD_MEMBER(this.guild.id, this.id),
      undefined,
      undefined,
      null,
      true
    )
    if (resp.ok !== true) return false
    else return true
  }

  /**
   * Bans the Member.
   * @param reason Reason for the Ban.
   * @param deleteMessagesDays Delete Old Messages? If yes, how much days.
   */
  async ban(reason?: string, deleteOldMessages?: number): Promise<void> {
    return this.guild.bans.add(this.id, reason, deleteOldMessages)
  }
}
