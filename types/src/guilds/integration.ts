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
  bot?: UserPayload;
  description: string;
  icon: null | string;
  id: snowflake;
  name: string;
}

export interface IntegrationPayload {
  account: IntegrationAccountPayload;
  application?: IntegrationApplicationPayload;
  enable_emoticons?: boolean;
  enabled: boolean;
  expire_behavior?: IntegrationExpireBehaviors;
  expire_grace_period?: number;
  id: snowflake;
  name: string;
  revoked?: boolean;
  role_id?: snowflake;
  scopes?: Scopes[];
  subscriber_count?: number;
  synced_at?: string;
  syncing?: boolean;
  type: string;
  user?: UserPayload;
}
