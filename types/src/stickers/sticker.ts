import { UserPayload } from "../users/user.ts";

export interface StickerPayload {
  id: string;
  pack_id?: string;
  name: string;
  description: string | null;
  tags: string;
  type: StickerType;
  format_type: StickerFormatType;
  available?: boolean;
  guild_id?: string;
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
  id: string;
  name: string;
  format_type: StickerFormatType;
}

export interface StickerPackPayload {
  id: string;
  stickers: StickerPayload[];
  name: string;
  sku_id: string;
  cover_sticker_id?: string;
  description: string;
  banner_asset_id?: string;
}

export interface ListNitroStickerPacksPayload {
  sticker_packs: StickerPackPayload[];
}

export interface CreateGuildStickerPayload {
  name: string;
  description: string;
  tags: string;
  file: Blob;
}

export interface EditGuildStickerPayload {
  name?: string;
  description?: string;
  tags?: string;
}
