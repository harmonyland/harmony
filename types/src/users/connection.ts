import { IntegrationPayload } from "../guilds/integration.ts";

export interface ConnectionPayload {
  id: string;
  name: string;
  type: string;
  revoked?: boolean;
  integrations?: IntegrationPayload[];
  verified: boolean;
  friend_sync: boolean;
  show_activity: boolean;
  visibility: VisibilityType;
}

export enum VisibilityType {
  NONE = 0,
  EVERYONE = 1,
}
