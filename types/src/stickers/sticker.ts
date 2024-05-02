import { snowflake } from "../common.ts";
import { Reasonable } from "../etc/reasonable.ts";
import { UserPayload } from "../users/user.ts";

export interface StickerPayload {
  id: snowflake;
  pack_id?: snowflake;
  name: string;
  description: string | null;
  tags: string;
  type: StickerType;
  format_type: StickerFormatType;
  available?: boolean;
  guild_id?: snowflake;
  user?: UserPayload;
  sort_value?: number;
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
  id: snowflake;
  name: string;
  format_type: StickerFormatType;
}

export interface StickerPackPayload {
  id: snowflake;
  stickers: StickerPayload[];
  name: string;
  sku_id: snowflake;
  cover_sticker_id?: snowflake;
  description: string;
  banner_asset_id?: snowflake;
}

export interface ListNitroStickerPacksPayload {
  sticker_packs: StickerPackPayload[];
}

export interface CreateGuildStickerPayload extends Reasonable {
  name: string;
  description: string;
  tags: string;
  file: Blob;
}

export interface EditGuildStickerPayload extends Reasonable {
  name?: string;
  description?: string;
  tags?: string;
}
