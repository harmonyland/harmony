import type { Client } from '../client/mod.ts'
import type { ChannelPayload } from '../types/channel.ts'
import { INVITE } from '../types/endpoint.ts'
import type { GuildPayload } from '../types/guild.ts'
import type { InviteMetadataPayload, InvitePayload } from '../types/invite.ts'
import type { UserPayload } from '../types/user.ts'
import { Base } from './base.ts'

export class Invite extends Base {
  code!: string
  guild?: GuildPayload
  channel!: ChannelPayload
  inviter?: UserPayload
  targetUser?: UserPayload
  targetUserType?: number
  approximatePresenceCount?: number
  approximateMemberCount?: number

  /** Number of times Invite was used. This is an Invite Metadata property (not always available) */
  uses?: number
  /** Max number of times this Invite can be used. This is an Invite Metadata property (not always available) */
  maxUses?: number
  /** Max age of the Invite in seconds. This is an Invite Metadata property (not always available) */
  maxAge?: number
  /** Whether Invite is temporary or not. This is an Invite Metadata property (not always available) */
  temporary?: boolean
  /** Timestamp (string) when Invite was created. This is an Invite Metadata property (not always available) */
  createdAtTimestamp?: string

  /** Timestamp (Date) when Invite was created. This is an Invite Metadata property (not always available) */
  get createdAt(): Date | undefined {
    return this.createdAtTimestamp === undefined
      ? undefined
      : new Date(this.createdAtTimestamp)
  }

  get link(): string {
    return `https://discord.gg/${this.code}`
  }

  toString(): string {
    return this.link
  }

  constructor(
    client: Client,
    data: InvitePayload & Partial<InviteMetadataPayload>
  ) {
    super(client)
    this.readFromData(data)
  }

  /** Delete an invite. Requires the MANAGE_CHANNELS permission on the channel this invite belongs to, or MANAGE_GUILD to remove any invite across the guild. Returns an invite object on success. Fires a Invite Delete Gateway event. */
  async delete(): Promise<Invite> {
    const res = await this.client.rest.delete(INVITE(this.code))
    return new Invite(this.client, res)
  }

  readFromData(data: InvitePayload & Partial<InviteMetadataPayload>): void {
    this.code = data.code ?? this.code
    this.guild = data.guild ?? this.guild
    this.channel = data.channel ?? this.channel
    this.inviter = data.inviter ?? this.inviter
    this.targetUser = data.target_user ?? this.targetUser
    this.targetUserType = data.target_user_type ?? this.targetUserType
    this.approximateMemberCount =
      data.approximate_member_count ?? this.approximateMemberCount
    this.approximatePresenceCount =
      data.approximate_presence_count ?? this.approximatePresenceCount

    this.uses = data.uses ?? this.uses
    this.maxUses = data.max_uses ?? this.maxUses
    this.maxAge = data.max_age ?? this.maxAge
    this.temporary = data.temporary ?? this.temporary
    this.createdAtTimestamp =
      (data.created_at === undefined
        ? undefined
        : new Date(data.created_at).toISOString()) ?? this.createdAtTimestamp
  }
}
