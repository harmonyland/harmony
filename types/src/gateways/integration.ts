import { IntegrationPayload } from "../guilds/integration.ts";

export interface GatewayIntegrationCreatePayload extends IntegrationPayload {
  guild_id: string;
}

export type GatewayIntegrationUpdatePayload = GatewayIntegrationCreatePayload;

export interface GatewayIntegrationDeletePayload {
  id: string;
  guild_id: string;
  application_id?: string;
}
