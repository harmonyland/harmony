/** @link https://discord.com/developers/docs/resources/channel#embed-object-embed-types */
export enum EmbedType {
  RICH = "rich",
  IMAGE = "image",
  VIDEO = "video",
  GIFV = "gifv",
  ARTICLE = "article",
  LINK = "link",
}

/** @link https://discord.com/developers/docs/resources/channel#embed-object-embed-video-structure */
export interface EmbedVideoPayload {
  url: string;
  proxy_url?: string;
  height?: number;
  width?: number;
}

/** @link https://discord.com/developers/docs/resources/channel#embed-object-embed-image-structure */
export interface EmbedImagePayload {
  url: string;
  proxy_url?: string;
  height?: number;
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
  name: string;
  url?: string;
  icon_url?: string;
  proxy_icon_url?: string;
}

/** @link https://discord.com/developers/docs/resources/channel#embed-object-embed-footer-structure */
export interface EmbedFooterPayload {
  text: string;
  icon_url?: string;
  proxy_icon_url?: string;
}

/** @link https://discord.com/developers/docs/resources/channel#embed-object-embed-field-structure */
export interface EmbedFieldPayload {
  name: string;
  value: string;
  inline?: boolean;
}

/** @link https://discord.com/developers/docs/resources/channel#embed-object-embed-structure */
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
