import type { Client } from '../client/mod.ts'
import { ApplicationFlags, ApplicationPayload } from '../types/application.ts'
import { SnowflakeBase } from './base.ts'
import { User } from './user.ts'
import { Team } from './team.ts'
import { BitField, BitFieldResolvable } from '../utils/bitfield.ts'

export class ApplicationFlagsManager extends BitField {
  constructor(bits: BitFieldResolvable | undefined) {
    super(ApplicationFlags, bits ?? 0)
  }
}

export class Application extends SnowflakeBase {
  id: string
  name: string
  icon: string
  description: string
  summary: string
  bot?: User
  team?: Team
  rpcOrigins?: string[]
  botPublic?: boolean
  botRequireCodeGrant?: boolean
  termsOfServiceURL?: string
  privacyPolicyURL?: string
  owner?: User
  verifyKey?: string
  guildID?: string
  primarySkuID?: string
  slug?: string
  coverImage?: string
  flags: ApplicationFlagsManager

  constructor(client: Client, data: ApplicationPayload) {
    super(client, data)

    this.id = data.id
    this.name = data.name
    this.icon = data.icon
    this.description = data.description
    this.summary = data.summary
    this.bot = data.bot !== undefined ? new User(client, data.bot) : undefined
    this.team = data.team !== null ? new Team(client, data.team) : undefined
    this.rpcOrigins = data.rpc_origins
    this.botPublic = data.bot_public
    this.botRequireCodeGrant = data.bot_require_code_grant
    this.termsOfServiceURL = data.terms_of_service_url
    this.privacyPolicyURL = data.privacy_policy_url
    this.owner =
      data.owner !== undefined ? new User(client, data.owner) : undefined
    this.verifyKey = data.verify_key
    this.guildID = data.guild_id
    this.primarySkuID = data.primary_sku_id
    this.slug = data.slug
    this.coverImage = data.cover_image
    this.flags = new ApplicationFlagsManager(data.flags)
  }
}
