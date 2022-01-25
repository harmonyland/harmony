import { UserPayload } from "../users/user.ts";

export enum IntegrationExpireBehaviors {
  REMOVE_ROLE = 0,
  KICK = 1,
}

export interface IntegrationAccountPayload {
  id: string;
  name: string;
}

export interface IntegrationApplicationPayload {
  id: string;
  name: string;
  icon: string | null;
  description: string;
  summary: string;
  bot?: UserPayload;
}

export interface IntegrationPayload {
  id: string;
  name: string;
  type: string;
  enabled: boolean;
  syncing?: boolean;
  role_id?: string;
  enable_emoticons?: boolean;
  expire_behavior?: IntegrationExpireBehaviors;
  expire_grace_period?: number;
  user?: UserPayload;
  account: IntegrationAccountPayload;
  synced_at?: string;
  subscriber_count?: number;
  revoked?: boolean;
  application: IntegrationApplicationPayload;
}
