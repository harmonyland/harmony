import { snowflake } from "../common.ts";

export interface EntitlementPayload {
  application_id: snowflake;
  consumed?: boolean;
  deleted: boolean;
  ends_at?: string;
  guild_id?: snowflake;
  id: snowflake;
  sku_id: snowflake;
  starts_at?: string;
  type: EntitlementType;
  user_id?: snowflake;
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
  after?: snowflake;
  before?: snowflake;
  exclude_ended?: boolean;
  guild_id?: snowflake;
  limit?: number;
  sku_id?: string;
  user_id?: snowflake;
}

export interface CreateTestEntitlementPayload {
  owner_id: snowflake;
  owner_type: TestEntitlementOwnerType;
  sku_id: snowflake;
}

export enum TestEntitlementOwnerType {
  GUILD = 1,
  USER = 2,
}
