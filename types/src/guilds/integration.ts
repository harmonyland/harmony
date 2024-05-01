import { snowflake } from "../common.ts";
import { Scopes } from "../etc/scopes.ts";
import { UserPayload } from "../users/user.ts";

export enum IntegrationExpireBehaviors {
  REMOVE_ROLE = 0,
  KICK = 1,
}

export interface IntegrationAccountPayload {
  id: snowflake;
  name: string;
}

export interface IntegrationApplicationPayload {
  id: snowflake;
  name: string;
  icon: string | null;
  description: string;
  bot?: UserPayload;
}

export interface IntegrationPayload {
  id: snowflake;
  name: string;
  type: string;
  enabled: boolean;
  syncing?: boolean;
  role_id?: snowflake;
  enable_emoticons?: boolean;
  expire_behavior?: IntegrationExpireBehaviors;
  expire_grace_period?: number;
  user?: UserPayload;
  account: IntegrationAccountPayload;
  synced_at?: string;
  subscriber_count?: number;
  revoked?: boolean;
  application?: IntegrationApplicationPayload;
  scopes?: Scopes[];
}
