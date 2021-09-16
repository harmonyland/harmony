// deno-lint-ignore-file camelcase

export enum EmbedType {
  RICH = "rich",
  IMAGE = "image",
  VIDEO = "video",
  GIFV = "gifv",
  ARTICLE = "article",
  LINK = "link",
}

export interface EmbedVideoPayload {
  url?: string;
  proxy_url?: string;
  height?: number;
  width?: number;
}

export interface EmbedImagePayload {
  url?: string;
  proxy_url?: string;
  height?: number;
  width?: number;
}

export type EmbedThumbnailPayload = EmbedImagePayload;

export interface EmbedProviderPayload {
  name?: string;
  url?: string;
}

export interface EmbedAuthorPayload {
  name?: string;
  url?: string;
  icon_url?: string;
  proxy_icon_url?: string;
}

export interface EmbedFooterPayload {
  text?: string;
  icon_url?: string;
  proxy_icon_url?: string;
}

export interface EmbedFieldPayload {
  name?: string;
  value?: string;
  inline?: boolean;
}

export interface EmbedPayload {
  title?: string;
  type?: EmbedType;
  description?: string;
  url?: string;
  timestamp?: string;
  color?: number;
  footer?: EmbedFooterPayload;
  image?: EmbedImagePayload;
  thumbnail?: EmbedThumbnailPayload;
  video?: EmbedVideoPayload;
  provider?: EmbedProviderPayload;
  author?: EmbedAuthorPayload;
  fields?: EmbedFieldPayload[];
}
