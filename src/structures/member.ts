import { MemberRolesManager } from '../managers/memberRoles.ts'
import type { Client } from '../client/mod.ts'
import { GUILD_MEMBER, GUILD_MEMBER_AVATAR } from '../types/endpoint.ts'
import type { MemberPayload } from '../types/guild.ts'
import { Permissions } from '../utils/permissions.ts'
import { SnowflakeBase } from './base.ts'
import type { Guild } from './guild.ts'
import type { VoiceChannel } from './guildVoiceChannel.ts'
import type { Role } from './role.ts'
import type { User } from './user.ts'
import { ImageURL } from './cdn.ts'
import type { ImageSize, ImageFormats } from '../types/cdn.ts'

export interface MemberData {
  nick?: string | null
  roles?: Array<Role | string>
  deaf?: boolean
  mute?: boolean
  channel?: string | VoiceChannel | null
  communicationDisabledUntil?: Date | null
}

export class Member extends SnowflakeBase {
  user: User
  nick!: string | null
  avatar!: string | null
  roles: MemberRolesManager
  joinedAt!: string
  premiumSince?: string
  deaf!: boolean
  mute!: boolean
  guild: Guild
  permissions: Permissions
  communicationDisabledUntil?: Date | null

  constructor(
    client: Client,
    data: MemberPayload,
    user: User,
    guild: Guild,
    perms?: Permissions
  ) {
    super(client)
    this.id = data.user.id
    this.readFromData(data)
    this.user = user
    this.guild = guild
    this.roles = new MemberRolesManager(this.client, this.guild.roles, this)
    this.permissions = perms ?? new Permissions(Permissions.DEFAULT)
    this.roles
      .array()
      .then((roles) => {
        const rolePermissions: string[] = []

        for (const role of roles) {
          rolePermissions.push(
            ...role.permissions
              .toArray()
              .filter((p) => !rolePermissions.includes(p))
          )
        }

        this.permissions.remove(
          ...this.permissions
            .toArray()
            .filter((p) => !rolePermissions.includes(p))
        )
        this.permissions.add(
          ...rolePermissions.filter(
            (p) => this.permissions.toArray().includes(p) === false
          )
        )
      })
      .catch((e) => {
        // probably missing permissions, ignore
      })
  }

  get displayName(): string {
    return this.nick !== null ? this.nick : this.user.username
  }

  toString(): string {
    return this.user.nickMention
  }

  readFromData(data: MemberPayload): void {
    this.nick = data.nick ?? this.nick
    this.avatar = data.avatar ?? this.avatar
    this.joinedAt = data.joined_at ?? this.joinedAt
    this.premiumSince = data.premium_since ?? this.premiumSince
    this.deaf = data.deaf ?? this.deaf
    this.mute = data.mute ?? this.mute
    this.communicationDisabledUntil =
      data.communication_disabled_until === null
        ? null
        : data.communication_disabled_until === undefined
        ? undefined
        : new Date(data.communication_disabled_until)
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
   * @param reason Audit Log reason
   */
  async edit(data: MemberData, reason?: string): Promise<Member> {
    const payload = {
      nick: data.nick,
      roles: data.roles?.map((e) => (typeof e === 'string' ? e : e.id)),
      deaf: data.deaf,
      mute: data.mute,
      communication_disabled_until:
        data.communicationDisabledUntil?.toISOString(),
      channel_id:
        typeof data.channel === 'string' ? data.channel : data.channel?.id
    }

    const res = await this.client.rest.patch(
      GUILD_MEMBER(this.guild.id, this.id),
      payload,
      undefined,
      null,
      true,
      {
        reason
      }
    )
    if (res.ok === true) {
      if (data.nick !== undefined)
        this.nick = data.nick === null ? null : data.nick
      if (data.deaf !== undefined) this.deaf = data.deaf
      if (data.mute !== undefined) this.mute = data.mute
    }
    return this
  }

  /**
   * New nickname to set. If empty, nick is reset
   * @param nick New nickname
   */
  async setNickname(nick?: string, reason?: string): Promise<Member> {
    return await this.edit(
      {
        nick: nick === undefined ? null : nick
      },
      reason
    )
  }

  /**
   * Resets nickname of the Member
   */
  async resetNickname(reason?: string): Promise<Member> {
    return await this.setNickname(undefined, reason)
  }

  /**
   * Sets a Member mute in VC
   * @param mute Value to set
   */
  async setMute(mute?: boolean, reason?: string): Promise<Member> {
    return await this.edit(
      {
        mute: mute ?? false
      },
      reason
    )
  }

  /**
   * Sets Timeout for the Member
   * @param expiration Value to set
   */
  async setTimeout(expiration?: Date | null, reason?: string): Promise<Member> {
    return await this.edit(
      {
        communicationDisabledUntil: expiration
      },
      reason
    )
  }

  /**
   * Resets Timeout for the Member
   */
  async resetTimeout(reason?: string): Promise<Member> {
    return await this.setTimeout(null, reason)
  }

  /**
   * Sets a Member deaf in VC
   * @param deaf Value to set
   */
  async setDeaf(deaf?: boolean, reason?: string): Promise<Member> {
    return await this.edit(
      {
        deaf: deaf ?? false
      },
      reason
    )
  }

  /**
   * Moves a Member to another VC
   * @param channel Channel to move(null or undefined to disconnect)
   */
  async moveVoiceChannel(
    channel?: string | VoiceChannel | null,
    reason?: string
  ): Promise<Member> {
    return await this.edit(
      {
        channel: channel ?? null
      },
      reason
    )
  }

  /**
   * Disconnects a Member from connected VC
   */
  async disconnectVoice(reason?: string): Promise<Member> {
    return await this.edit(
      {
        channel: null
      },
      reason
    )
  }

  /**
   * Unmutes the Member from VC.
   */
  async unmute(): Promise<Member> {
    return await this.setMute(false)
  }

  /**
   * Undeafs the Member from VC.
   */
  async undeaf(): Promise<Member> {
    return await this.setDeaf(false)
  }

  /**
   * Kicks the member.
   */
  async kick(reason?: string): Promise<boolean> {
    await this.client.rest.delete(
      GUILD_MEMBER(this.guild.id, this.id),
      undefined,
      undefined,
      null,
      undefined,
      {
        reason
      }
    )
    return true
  }

  /**
   * Bans the Member.
   * @param reason Reason for the Ban.
   * @param deleteOldMessages Delete Old Messages? If yes, how much days.
   */
  async ban(reason?: string, deleteOldMessages?: number): Promise<void> {
    return this.guild.bans.add(this.id, reason, deleteOldMessages)
  }

  async manageable(by?: Member): Promise<boolean> {
    by = by ?? (await this.guild.me())
    if (this.id === this.guild.ownerID || this.id === by.id) return false
    if (this.guild.ownerID === by.id) return true
    const highestBy = (await by.roles.array()).sort(
      (b, a) => a.position - b.position
    )[0]
    const highest = (await this.roles.array()).sort(
      (b, a) => a.position - b.position
    )[0]
    return highestBy.position > highest.position
  }

  async bannable(by?: Member): Promise<boolean> {
    const manageable = await this.manageable(by)
    if (!manageable) return false
    const me = by ?? (await this.guild.me())
    return me.permissions.has('BAN_MEMBERS')
  }

  async kickable(by?: Member): Promise<boolean> {
    const manageable = await this.manageable(by)
    if (!manageable) return false
    const me = by ?? (await this.guild.me())
    return me.permissions.has('KICK_MEMBERS')
  }

  avatarURL(format: ImageFormats = 'png', size: ImageSize = 512): string {
    return this.avatar !== null && this.avatar !== undefined
      ? `${ImageURL(
          GUILD_MEMBER_AVATAR(this.guild.id, this.user.id, this.avatar),
          format,
          size
        )}`
      : this.user.avatarURL(format, size)
  }

  async effectiveColor(): Promise<number> {
    return (
      (await this.roles.array())
        .sort((a, b) => b.position - a.position)
        .find((r) => r.color !== 0)?.color ?? 0
    )
  }
}
