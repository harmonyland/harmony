import { snowflake } from "../common.ts";
import { Reasonable } from "../etc/reasonable.ts";
import { UserPayload } from "../users/user.ts";

export interface StickerPayload {
  available?: boolean;
  description: null | string;
  format_type: StickerFormatType;
  guild_id?: snowflake;
  id: snowflake;
  name: string;
  pack_id?: snowflake;
  sort_value?: number;
  tags: string;
  type: StickerType;
  user?: UserPayload;
}

export enum StickerType {
  STANDARD = 1,
  GUILD = 2,
}

export enum StickerFormatType {
  PNG = 1,
  APNG = 2,
  LOTTIE = 3,
  GIF = 4,
}

export interface StickerItemPayload {
  format_type: StickerFormatType;
  id: snowflake;
  name: string;
}

export interface StickerPackPayload {
  banner_asset_id?: snowflake;
  cover_sticker_id?: snowflake;
  description: string;
  id: snowflake;
  name: string;
  sku_id: snowflake;
  stickers: StickerPayload[];
}

export interface ListNitroStickerPacksPayload {
  sticker_packs: StickerPackPayload[];
}

export interface CreateGuildStickerPayload extends Reasonable {
  description: string;
  file: Blob;
  name: string;
  tags: string;
}

export interface EditGuildStickerPayload extends Reasonable {
  description?: string;
  name?: string;
  tags?: string;
}
