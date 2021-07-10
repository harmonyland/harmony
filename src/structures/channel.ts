import type { Client } from '../client/mod.ts'
import type {
  ChannelPayload,
  ChannelTypes,
  ModifyChannelOption,
  ModifyChannelPayload,
  Overwrite,
  OverwritePayload,
  OverwriteAsArg
} from '../types/channel.ts'
import { OverrideType } from '../types/channel.ts'
import { CHANNEL } from '../types/endpoint.ts'
import type { GuildChannelPayloads, GuildChannels } from '../types/guild.ts'
import getChannelByType from '../utils/channel.ts'
import {
  isDMChannel,
  isGroupDMChannel,
  isThreadChannel,
  isCategoryChannel,
  isGuildBasedTextChannel,
  isGuildChannel,
  isGuildTextChannel,
  isNewsChannel,
  isStageVoiceChannel,
  isStoreChannel,
  isTextChannel,
  isVoiceChannel
} from '../utils/channelTypes.ts'
import { Permissions } from '../utils/permissions.ts'
import { SnowflakeBase } from './base.ts'
import type { Guild } from './guild.ts'
import { Member } from './member.ts'
import { Role } from './role.ts'
import type { DMChannel } from '../structures/dmChannel.ts'
import type { GroupDMChannel } from '../structures/groupChannel.ts'
import type { CategoryChannel } from '../structures/guildCategoryChannel.ts'
import type { NewsChannel } from '../structures/guildNewsChannel.ts'
import type { StoreChannel } from '../structures/guildStoreChannel.ts'
import type {
  GuildTextBasedChannel,
  GuildTextChannel
} from '../structures/guildTextChannel.ts'
import type { VoiceChannel } from '../structures/guildVoiceChannel.ts'
import type { StageVoiceChannel } from '../structures/guildVoiceStageChannel.ts'
import { TextChannel } from '../structures/textChannel.ts'
import type { ThreadChannel } from '../structures/threadChannel.ts'

export class Channel extends SnowflakeBase {
  type: ChannelTypes
  id: string
  static cacheName = 'channel'
  get mention(): string {
    return `<#${this.id}>`
  }

  constructor(client: Client, data: ChannelPayload) {
    super(client, data)
    this.type = data.type
    this.id = data.id
  }

  readFromData(data: ChannelPayload): void {
    this.type = data.type ?? this.type
    this.id = data.id ?? this.id
  }

  isDM(): this is DMChannel {
    return isDMChannel(this)
  }

  isGroupDM(): this is GroupDMChannel {
    return isGroupDMChannel(this)
  }

  isGuild(): this is GuildChannel {
    return isGuildChannel(this)
  }

  isText(): this is TextChannel {
    return isTextChannel(this)
  }

  isVoice(): this is VoiceChannel {
    return isVoiceChannel(this)
  }

  isStage(): this is StageVoiceChannel {
    return isStageVoiceChannel(this)
  }

  isThread(): this is ThreadChannel {
    return isThreadChannel(this)
  }

  isGuildTextBased(): this is GuildTextBasedChannel {
    return isGuildBasedTextChannel(this)
  }

  isGuildText(): this is GuildTextChannel {
    return isGuildTextChannel(this)
  }

  isCategory(): this is CategoryChannel {
    return isCategoryChannel(this)
  }

  isNews(): this is NewsChannel {
    return isNewsChannel(this)
  }

  isStore(): this is StoreChannel {
    return isStoreChannel(this)
  }
}

export interface EditOverwriteOptions {
  /** Allow Override Type */
  allow?: OverrideType
  /** Deny Override Type */
  deny?: OverrideType
}

export class GuildChannel extends Channel {
  guildID: string
  name: string
  position: number
  permissionOverwrites: OverwritePayload[]
  guild: Guild
  nsfw: boolean
  parentID?: string

  constructor(client: Client, data: GuildChannelPayloads, guild: Guild) {
    super(client, data)
    this.guildID = data.guild_id
    this.name = data.name
    this.guild = guild
    this.position = data.position
    this.permissionOverwrites = data.permission_overwrites
    this.nsfw = data.nsfw
    this.parentID = data.parent_id
  }

  readFromData(data: GuildChannelPayloads): void {
    super.readFromData(data)
    this.guildID = data.guild_id ?? this.guildID
    this.name = data.name ?? this.name
    this.position = data.position ?? this.position
    this.permissionOverwrites =
      data.permission_overwrites ?? this.permissionOverwrites
    this.nsfw = data.nsfw ?? this.nsfw
    this.parentID = data.parent_id ?? this.parentID
  }

  /** Get Permission Overties for a specific Member or Role */
  async overwritesFor(target: Member | Role | string): Promise<Overwrite[]> {
    const stringToObject =
      typeof target === 'string'
        ? (await this.guild.members.get(target)) ??
          (await this.guild.roles.get(target))
        : target

    if (stringToObject === undefined) {
      throw new Error('Member or Role not found')
    } else {
      target = stringToObject
    }

    const roles =
      target instanceof Member ? await target.roles.array() : undefined

    const overwrites: Overwrite[] = []

    for (const overwrite of this.permissionOverwrites) {
      if (
        overwrite.id === this.guild.id ||
        roles?.some((e) => e.id === overwrite.id) === true ||
        overwrite.id === target.id
      ) {
        const id =
          (await this.guild.members.get(overwrite.id)) ??
          (await this.guild.roles.get(overwrite.id)) ??
          overwrite.id
        const allow = new Permissions(overwrite.allow)
        const deny = new Permissions(overwrite.deny)

        overwrites.push({
          id,
          type: overwrite.type,
          allow,
          deny
        })
      }
    }

    return overwrites
  }

  /** Get Permissions for a Member in this Channel */
  async permissionsFor(target: Member | Role | string): Promise<Permissions> {
    const id = typeof target === 'string' ? target : target.id
    if (id === this.guild.ownerID) return new Permissions(Permissions.ALL)

    const stringToObject =
      typeof target === 'string'
        ? (await this.guild.members.get(target)) ??
          (await this.guild.roles.get(target))
        : target

    if (stringToObject === undefined) {
      throw new Error('Member or Role not found')
    } else {
      target = stringToObject
    }

    if (target.permissions.has('ADMINISTRATOR') === true)
      return new Permissions(Permissions.ALL)

    const overwrites = await this.overwritesFor(target)
    const everyoneOW = overwrites.find((e) => e.id === this.guild.id)
    const roleOWs = overwrites.filter((e) => e.type === 0)
    const memberOWs = overwrites.filter((e) => e.type === 1)

    return target.permissions
      .remove(everyoneOW !== undefined ? Number(everyoneOW.deny) : 0)
      .add(everyoneOW !== undefined ? Number(everyoneOW.allow) : 0)
      .remove(roleOWs.length === 0 ? 0 : roleOWs.map((e) => Number(e.deny)))
      .add(roleOWs.length === 0 ? 0 : roleOWs.map((e) => Number(e.allow)))
      .remove(memberOWs.length === 0 ? 0 : memberOWs.map((e) => Number(e.deny)))
      .add(memberOWs.length === 0 ? 0 : memberOWs.map((e) => Number(e.allow)))
  }

  async edit(options?: ModifyChannelOption): Promise<GuildChannels> {
    const body: ModifyChannelPayload = {
      name: options?.name,
      position: options?.position,
      permission_overwrites: options?.permissionOverwrites,
      parent_id: options?.parentID,
      nsfw: options?.nsfw
    }

    const resp = await this.client.rest.patch(CHANNEL(this.id), body)

    return (
      (getChannelByType(this.client, resp, this.guild) as
        | GuildChannels
        | undefined) ?? new GuildChannel(this.client, resp, this.guild)
    )
  }

  /** Edit name of the channel */
  async setName(name: string): Promise<GuildChannels> {
    return await this.edit({ name })
  }

  /** Edit NSFW property of the channel */
  async setNSFW(nsfw: boolean): Promise<GuildChannels> {
    return await this.edit({ nsfw })
  }

  /** Set Permission Overwrites of the Channel */
  async setOverwrites(overwrites: OverwriteAsArg[]): Promise<GuildChannels> {
    const result = overwrites.map(
      (overwrite): OverwritePayload => {
        const id =
          typeof overwrite.id === 'string' ? overwrite.id : overwrite.id.id
        const allow =
          typeof overwrite.allow === 'string'
            ? overwrite.allow
            : overwrite.allow?.toJSON() ?? '0'
        const deny =
          typeof overwrite.deny === 'string'
            ? overwrite.deny
            : overwrite.deny?.toJSON() ?? '0'
        const type =
          overwrite.id instanceof Role
            ? 0
            : overwrite.id instanceof Member
            ? 1
            : overwrite.type
        if (type === undefined) {
          throw new Error('Overwrite type is undefined.')
        }

        return {
          id,
          type,
          allow,
          deny
        }
      }
    )
    return await this.edit({ permissionOverwrites: result })
  }

  /** Add a Permission Overwrite */
  async addOverwrite(overwrite: OverwriteAsArg): Promise<GuildChannels> {
    const overwrites = this.permissionOverwrites
    const id = typeof overwrite.id === 'string' ? overwrite.id : overwrite.id.id
    const allow =
      typeof overwrite.allow === 'string'
        ? overwrite.allow
        : overwrite.allow?.toJSON() ?? '0'
    const deny =
      typeof overwrite.deny === 'string'
        ? overwrite.deny
        : overwrite.deny?.toJSON() ?? '0'
    const type =
      overwrite.id instanceof Role
        ? 0
        : overwrite.id instanceof Member
        ? 1
        : overwrite.type
    if (type === undefined) {
      throw new Error('Overwrite type is undefined.')
    }

    overwrites.push({
      id,
      type,
      allow,
      deny
    })

    return await this.edit({ permissionOverwrites: overwrites })
  }

  /** Remove a Permission Overwrite */
  async removeOverwrite(
    target: Member | Role | string
  ): Promise<GuildChannels> {
    target = typeof target === 'string' ? target : target.id
    if (this.permissionOverwrites.find((e) => e.id === target) === undefined)
      throw new Error('Permission Overwrite not found')
    const overwrites = this.permissionOverwrites.filter((e) => e.id !== target)
    return await this.edit({ permissionOverwrites: overwrites })
  }

  /** Edit a Permission Overwrite */
  async editOverwrite(
    overwrite: OverwriteAsArg,
    {
      allow: overwriteAllow = OverrideType.ADD,
      deny: overwriteDeny = OverrideType.ADD
    }: EditOverwriteOptions
  ): Promise<GuildChannels> {
    const id = typeof overwrite.id === 'string' ? overwrite.id : overwrite.id.id
    const index = this.permissionOverwrites.findIndex((e) => e.id === id)
    if (index < 0) throw new Error('Permission Overwrite not found')
    const overwrites = this.permissionOverwrites

    let allow: string
    let deny: string

    if (
      overwrite.allow !== undefined &&
      overwriteAllow !== OverrideType.REPLACE
    ) {
      switch (overwriteAllow) {
        case OverrideType.ADD: {
          const originalAllow = new Permissions(overwrites[index].allow)
          const newAllow = new Permissions(overwrite.allow)

          allow = originalAllow.add([newAllow]).toJSON()
          break
        }
        case OverrideType.REMOVE: {
          const originalAllow = new Permissions(overwrites[index].allow)
          const newAllow = new Permissions(overwrite.allow)

          allow = originalAllow.remove([newAllow]).toJSON()
          break
        }
      }
    } else {
      allow =
        typeof overwrite.allow === 'string'
          ? overwrite.allow
          : overwrite.allow?.toJSON() ?? overwrites[index].allow
    }

    if (
      overwrite.deny !== undefined &&
      overwriteDeny !== OverrideType.REPLACE
    ) {
      switch (overwriteDeny) {
        case OverrideType.ADD: {
          const originalDeny = new Permissions(overwrites[index].deny)
          const newDeny = new Permissions(overwrite.deny)

          deny = originalDeny.add([newDeny]).toJSON()
          break
        }
        case OverrideType.REMOVE: {
          const originalDeny = new Permissions(overwrites[index].deny)
          const newDeny = new Permissions(overwrite.deny)

          deny = originalDeny.remove([newDeny]).toJSON()
          break
        }
      }
    } else {
      deny =
        typeof overwrite.deny === 'string'
          ? overwrite.deny
          : overwrite.deny?.toJSON() ?? overwrites[index].deny
    }

    const type =
      overwrite.id instanceof Role
        ? 0
        : overwrite.id instanceof Member
        ? 1
        : overwrite.type
    if (type === undefined) {
      throw new Error('Overwrite type is undefined.')
    }

    overwrites[index] = {
      id,
      type,
      allow,
      deny
    }
    return await this.edit({ permissionOverwrites: overwrites })
  }

  /** Edit position of the channel */
  async setPosition(position: number): Promise<GuildChannels> {
    return await this.edit({ position })
  }
}
