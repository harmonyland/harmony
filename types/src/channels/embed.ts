/** @link https://discord.com/developers/docs/resources/channel#embed-object-embed-types */
export enum EmbedType {
  ARTICLE = "article",
  GIFV = "gifv",
  IMAGE = "image",
  LINK = "link",
  RICH = "rich",
  VIDEO = "video",
}

/** @link https://discord.com/developers/docs/resources/channel#embed-object-embed-video-structure */
export interface EmbedVideoPayload {
  height?: number;
  proxy_url?: string;
  url: string;
  width?: number;
}

/** @link https://discord.com/developers/docs/resources/channel#embed-object-embed-image-structure */
export interface EmbedImagePayload {
  height?: number;
  proxy_url?: string;
  url: string;
  width?: number;
}

/** @link https://discord.com/developers/docs/resources/channel#embed-object-embed-thumbnail-structure */
export type EmbedThumbnailPayload = EmbedImagePayload;

/** @link https://discord.com/developers/docs/resources/channel#embed-object-embed-provider-structure */
export interface EmbedProviderPayload {
  name?: string;
  url?: string;
}

/** @link https://discord.com/developers/docs/resources/channel#embed-object-embed-author-structure */
export interface EmbedAuthorPayload {
  icon_url?: string;
  name: string;
  proxy_icon_url?: string;
  url?: string;
}

/** @link https://discord.com/developers/docs/resources/channel#embed-object-embed-footer-structure */
export interface EmbedFooterPayload {
  icon_url?: string;
  proxy_icon_url?: string;
  text: string;
}

/** @link https://discord.com/developers/docs/resources/channel#embed-object-embed-field-structure */
export interface EmbedFieldPayload {
  inline?: boolean;
  name: string;
  value: string;
}

/** @link https://discord.com/developers/docs/resources/channel#embed-object-embed-structure */
export interface EmbedPayload {
  author?: EmbedAuthorPayload;
  color?: number;
  description?: string;
  fields?: EmbedFieldPayload[];
  footer?: EmbedFooterPayload;
  image?: EmbedImagePayload;
  provider?: EmbedProviderPayload;
  thumbnail?: EmbedThumbnailPayload;
  timestamp?: string;
  title?: string;
  type?: EmbedType;
  url?: string;
  video?: EmbedVideoPayload;
}
