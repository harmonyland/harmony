import { snowflake } from "../common.ts";
import { IntegrationPayload } from "../guilds/integration.ts";

export interface GatewayIntegrationCreatePayload extends IntegrationPayload {
  guild_id: snowflake;
}

export type GatewayIntegrationUpdatePayload = GatewayIntegrationCreatePayload;

export interface GatewayIntegrationDeletePayload {
  id: string;
  guild_id: snowflake;
  application_id?: snowflake;
}
