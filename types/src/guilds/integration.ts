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
  application?: IntegrationApplicationPayload;
  scopes?: (
    | "activities.read"
    | "activities.write"
    | "applications.builds.read"
    | "applications.builds.upload"
    | "applications.commands"
    | "applications.commands.update"
    | "applications.commands.permissions.update"
    | "applications.entitlements"
    | "applications.store.update"
    | "bot"
    | "connections"
    | "dm_channels.read"
    | "email"
    | "gdm.join"
    | "guilds"
    | "guilds.join"
    | "guilds.members.read"
    | "identify"
    | "messages.read"
    | "relationships.read"
    | "role_connections.write"
    | "rpc"
    | "rpc.activities.write"
    | "rpc.notifications.read"
    | "rpc.voice.read"
    | "rpc.voice.write"
    | "voice"
    | "webhook.incoming"
  )[];
}
