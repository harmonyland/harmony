import { snowflake } from "../common.ts";

export interface EntitlementPayload {
  id: snowflake;
  sku_id: snowflake;
  application_id: snowflake;
  user_id?: snowflake;
  type: EntitlementType;
  deleted: boolean;
  starts_at?: string;
  ends_at?: string;
  guild_id?: snowflake;
  consumed?: boolean;
}

export enum EntitlementType {
  PURCHASE = 1,
  PREMIUM_SUBSCRIPTION = 2,
  DEVELOPER_GIFT = 3,
  TEST_MODE_PURCHASE = 4,
  FREE_PURCHASE = 5,
  USER_GIFT = 6,
  PREMIUM_PURCHASE = 7,
  APPLICATION_SUBSCRIPTION = 8,
}

export interface ListEntitlementsParams {
  user_id?: snowflake;
  sku_id?: string;
  before?: snowflake;
  after?: snowflake;
  limit?: number;
  guild_id?: snowflake;
  exclude_ended?: boolean;
}

export interface CreateTestEntitlementPayload {
  sku_id: snowflake;
  owner_id: snowflake;
  owner_type: TestEntitlementOwnerType;
}

export enum TestEntitlementOwnerType {
  GUILD = 1,
  USER = 2,
}
