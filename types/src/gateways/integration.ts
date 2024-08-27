import { snowflake } from "../common.ts";
import { IntegrationPayload } from "../guilds/integration.ts";

export interface GatewayIntegrationCreatePayload extends IntegrationPayload {
  guild_id: snowflake;
}

export type GatewayIntegrationUpdatePayload = GatewayIntegrationCreatePayload;

export interface GatewayIntegrationDeletePayload {
  application_id?: snowflake;
  guild_id: snowflake;
  id: string;
}
