import { Client } from '../models/client.ts'
import {
  EmbedAuthor,
  EmbedField,
  EmbedFooter,
  EmbedImage,
  EmbedPayload,
  EmbedProvider,
  EmbedThumbnail,
  EmbedTypes,
  EmbedVideo
} from '../types/channelTypes.ts'
import { Base } from './base.ts'

export class Embed extends Base implements EmbedPayload {
  title?: string
  type?: EmbedTypes
  description?: string
  url?: string
  timestamp?: string
  color?: number
  footer?: EmbedFooter
  image?: EmbedImage
  thumbnail?: EmbedThumbnail
  video?: EmbedVideo
  provider?: EmbedProvider
  author?: EmbedAuthor
  fields?: EmbedField[]
  constructor (client: Client, data: EmbedPayload) {
    super(client)
  }
}
