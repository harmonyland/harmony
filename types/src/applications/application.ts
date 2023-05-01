import { UserPayload } from "../users/user.ts";
import { TeamPayload } from "./team.ts";

export interface ApplicationPayload {
  id: string;
  name: string;
  icon: string | null;
  description: string;
  rpc_origins?: string[];
  bot_public: boolean;
  bot_require_code_grant: boolean;
  terms_of_service_url?: string;
  privacy_policy_url?: string;
  owner?: UserPayload;
  /** @deprecated It will be removed in v11. */
  summary: string;
  verify_key: string;
  team: TeamPayload | null;
  guild_id?: string;
  primary_sku_id?: string;
  slug?: string;
  cover_image?: string;
  /** Use it with ApplicationFlags. */
  flags?: number;
  tags?: string[];
  install_params?: ApplicationInstallParams;
  custom_install_url?: string;
  role_connections_verification_url?: string;
}

export interface ApplicationInstallParams {
  scopes: string[];
  permissions: string;
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
