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

export class Embed {
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
  constructor (client: Client, data?: EmbedPayload) {
    if (data !== undefined) {
      this.title = data.title
      this.type = data.type
      this.description = data.description
      this.url = data.url
      this.timestamp = data.timestamp
      this.color = data.color
      this.footer = data.footer
      this.image = data.image
      this.thumbnail = data.thumbnail
      this.video = data.video
      this.provider = data.provider
      this.author = data.author
      this.fields = data.fields
    }
  }
}
