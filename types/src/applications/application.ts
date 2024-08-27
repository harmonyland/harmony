import { snowflake } from "../common.ts";
import { TeamPayload } from "../teams/team.ts";
import { UserPayload } from "../users/user.ts";

export interface ApplicationPayload {
  approximate_guild_count?: number;
  bot_public: boolean;
  bot_require_code_grant: boolean;
  cover_image?: string;
  custom_install_url?: string;
  description: string;
  /** Use it with ApplicationFlags. */
  flags?: number;
  guild_id?: snowflake;
  icon: null | string;
  id: snowflake;
  install_params?: ApplicationInstallParams;
  integration_types_config?: Record<
    keyof ApplicationIntegrationType,
    ApplicationIntegrationTypeConfig
  >;
  interactions_endpoint_url?: string;
  name: string;
  owner?: UserPayload;
  primary_sku_id?: snowflake;
  privacy_policy_url?: string;
  redirect_uris?: string[];
  role_connections_verification_url?: string;
  rpc_origins?: string[];
  slug?: string;
  /** @deprecated It will be removed in v11. */
  summary: string;
  tags?: string[];
  team: null | TeamPayload;
  terms_of_service_url?: string;
  verify_key: string;
}

export enum ApplicationIntegrationType {
  GUILD_INSTALL = 0,
  USER_INSTALL = 1,
}

export interface ApplicationIntegrationTypeConfig {
  oauth2_install_params?: ApplicationInstallParams;
}

export interface ApplicationInstallParams {
  permissions: string;
  scopes: string[];
}

export enum ApplicationFlags {
  APPLICATION_AUTO_MODERATION_RULE_CREATE_BADGE = 1 << 6,
  GATEWAY_PRESENCE = 1 << 12,
  GATEWAY_PRESENCE_LIMITED = 1 << 13,
  GATEWAY_GUILD_MEMBERS = 1 << 14,
  GATEWAY_GUILD_MEMBERS_LIMITED = 1 << 15,
  VERIFICATION_PENDING_GUILD_LIMIT = 1 << 16,
  EMBEDDED = 1 << 17,
  GATEWAY_MESSAGE_CONTENT = 1 << 18,
  GATEWAY_MESSAGE_CONTENT_LIMITED = 1 << 19,
  APPLICATION_COMMAND_BADGE = 1 << 23,
}

export interface EditApplicationPayload {
  cover_image?: null | string;
  custom_install_url?: string;
  description?: string;
  flags?: number;
  icon?: null | string;
  install_params?: ApplicationInstallParams;
  integration_types_config?: Record<
    keyof ApplicationIntegrationType,
    ApplicationIntegrationTypeConfig
  >;
  interactions_endpoint_url?: string;
  role_connections_verification_url?: string;
  tags?: string[];
}
