import type {
  EmbedAuthor,
  EmbedField,
  EmbedFooter,
  EmbedImage,
  EmbedPayload,
  EmbedProvider,
  EmbedThumbnail,
  EmbedTypes,
  EmbedVideo
} from '../types/channel.ts'
import { Colors, ColorUtil } from '../utils/colorutil.ts'
import type { MessageAttachment } from './message.ts'

/** Message Embed Object */
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
  files: MessageAttachment[] = []

  static MAX_TITLE_LENGTH = 256
  static MAX_DESCRIPTION_LENGTH = 4096
  static MAX_FIELD_NAME_LENGTH = 256
  static MAX_FIELD_VALUE_LENGTH = 1024
  static MAX_FIELDS_LENGTH = 25
  static MAX_FOOTER_TEXT_LENGTH = 2048
  static MAX_AUTHOR_NAME_LENGTH = 256
  static MAX_EMBED_LENGTH = 6000

  constructor(data?: EmbedPayload) {
    this.title = data?.title
    this.type = data?.type
    this.description = data?.description
    this.url = data?.url
    this.timestamp = data?.timestamp
    this.color = data?.color
    this.footer = data?.footer
    this.image = data?.image
    this.thumbnail = data?.thumbnail
    this.video = data?.video
    this.provider = data?.provider
    this.author = data?.author
    this.fields = data?.fields
  }

  /** Convert Embed Object to Embed Payload JSON */
  toJSON(): EmbedPayload {
    let total = 0
    if (
      this.title?.length !== undefined &&
      this.title?.length > Embed.MAX_TITLE_LENGTH
    ) {
      total += Number(this.title.length)
      throw new Error(
        `Embed title cannot exceed ${Embed.MAX_TITLE_LENGTH} characters.`
      )
    }

    if (
      this.description?.length !== undefined &&
      this.description?.length > Embed.MAX_DESCRIPTION_LENGTH
    ) {
      total += Number(this.description.length)
      throw new Error(
        `Embed description cannot exceed ${Embed.MAX_DESCRIPTION_LENGTH} characters.`
      )
    }

    if (this.fields?.length !== undefined) {
      this.fields.forEach((field) => {
        if (field.name.length > Embed.MAX_FIELD_NAME_LENGTH) {
          total += Number(field.name.length)
          throw new Error(
            `Embed field name cannot exceed ${Embed.MAX_FIELD_NAME_LENGTH} characters.`
          )
        }

        if (field.value.length > Embed.MAX_FIELD_VALUE_LENGTH) {
          total += Number(field.value.length)
          throw new Error(
            `Embed field value cannot exceed ${Embed.MAX_FIELD_VALUE_LENGTH} characters.`
          )
        }
      })
      if (this.fields.length > Embed.MAX_FIELDS_LENGTH)
        throw new Error('Embed fields cannot exceed 25 field objects.')
    }

    if (
      this.footer?.text?.length !== undefined &&
      this.footer?.text?.length > Embed.MAX_FOOTER_TEXT_LENGTH
    ) {
      total += Number(this.footer?.text?.length)
      throw new Error(
        `Embed footer text cannot exceed ${Embed.MAX_FOOTER_TEXT_LENGTH}.`
      )
    }

    if (
      this.author?.name?.length !== undefined &&
      this.author?.name?.length > Embed.MAX_AUTHOR_NAME_LENGTH
    ) {
      total += Number(this.author?.name?.length)
      throw new Error(
        `Embed author name cannot exceed ${Embed.MAX_AUTHOR_NAME_LENGTH}.`
      )
    }

    if (total > Embed.MAX_EMBED_LENGTH)
      throw new Error(
        `Embed characters cannot exceed ${Embed.MAX_EMBED_LENGTH} characters in total.`
      )

    return {
      title: this.title,
      type: this.type,
      description: this.description,
      url: this.url,
      timestamp: this.timestamp,
      color: this.color,
      footer: this.footer,
      image: this.image,
      thumbnail: this.thumbnail,
      video: this.video,
      provider: this.provider,
      author: this.author,
      fields: this.fields
    }
  }

  /** Set Title of the Embed */
  setTitle(title: string): Embed {
    this.title = title
    return this
  }

  /** Set Embed description */
  setDescription(description: string): Embed {
    this.description = description
    return this
  }

  attach(...files: MessageAttachment[]): Embed {
    for (const file of files) {
      this.files.push(file)
    }
    return this
  }

  /** Set Embed Type */
  setType(type: EmbedTypes): Embed {
    this.type = type
    return this
  }

  /** Set URL of the Embed */
  setURL(url: string | URL): Embed {
    this.url = typeof url === 'object' ? url.toString() : url
    return this
  }

  /** Set Timestamp of the Embed */
  setTimestamp(timeString: string): Embed
  setTimestamp(unixTimestamp: number): Embed
  setTimestamp(dateObject: Date): Embed
  setTimestamp(timestamp: string | Date | number): Embed {
    this.timestamp = new Date(timestamp).toISOString()
    return this
  }

  /** Set Color of the Embed */
  setColor(hexInt: number): Embed
  setColor(r: number, g: number, b: number): Embed
  setColor(random: 'random'): Embed
  setColor(hexStr: string): Embed
  setColor(namedColor: keyof Colors): Embed
  setColor(
    color: number | 'random' | string | keyof Colors,
    g?: number,
    b?: number
  ): Embed {
    if (typeof color === 'number' && g === undefined && b === undefined) {
      this.color = color
    } else if (typeof color === 'string' && color.toLowerCase() === 'random') {
      this.color = ColorUtil.resolveHex(ColorUtil.randomHex())
    } else if (typeof color === 'string' && color.startsWith('#')) {
      this.color = ColorUtil.resolveHex(color)
    } else if (
      typeof color === 'number' &&
      g !== undefined &&
      b !== undefined
    ) {
      this.color = ColorUtil.resolveRGB([color, g, b])
    } else if (typeof color === 'string') {
      this.color = ColorUtil.resolveColor(color as keyof Colors)
    } else
      throw new Error(
        'Invalid Embed Color. Must be RGB, Hex (string or number), valid color name or a valid CSS color.'
      )
    return this
  }

  /** Set Footer of the Embed */
  setFooter(text: string, icon?: string): Embed
  setFooter(footer: EmbedFooter): Embed
  setFooter(footer: EmbedFooter | string, icon?: string): Embed {
    this.footer =
      typeof footer === 'string' ? { text: footer, icon_url: icon } : footer
    return this
  }

  /** Set Image of the Embed */
  setImage(image: EmbedImage | string): Embed {
    this.image = typeof image === 'string' ? { url: image } : image
    return this
  }

  /** Set Thumbnail Image of the Embed */
  setThumbnail(thumbnail: EmbedThumbnail | string): Embed {
    this.thumbnail =
      typeof thumbnail === 'string' ? { url: thumbnail } : thumbnail
    return this
  }

  /** Set Embed Video */
  setVideo(video: EmbedVideo | string): Embed {
    this.video = typeof video === 'string' ? { url: video } : video
    return this
  }

  /** Set Provider of the Embed */
  setProvider(name: string, url?: string): Embed
  setProvider(provider: EmbedProvider): Embed
  setProvider(provider: EmbedProvider | string, url?: string): Embed {
    this.provider =
      typeof provider === 'string' ? { name: provider, url } : provider
    return this
  }

  /** Set Author of the Embed */
  setAuthor(author: EmbedAuthor): Embed
  setAuthor(name: string, image?: string): Embed
  setAuthor(author: EmbedAuthor | string, image?: string): Embed {
    this.author =
      typeof author === 'string' ? { name: author, icon_url: image } : author
    return this
  }

  setFields(fields: EmbedField[]): Embed {
    this.fields = fields
    return this
  }

  /** Adds a Field to the Embed */
  addField(field: EmbedField): Embed
  addField(name: string, value: string, inline?: boolean): Embed
  addField(name: string | EmbedField, value?: string, inline?: boolean): Embed {
    if (typeof name !== 'object' && value === undefined)
      throw new Error('field value is required')
    const field: EmbedField =
      typeof name === 'object' ? name : { name, value: value as string, inline }

    if (this.fields === undefined) {
      this.fields = [field]
    } else {
      this.fields.push(field)
    }

    return this
  }

  /** Adds multiple fields to the Embed */
  addFields(...fields: EmbedField[]): Embed {
    for (const field of fields) {
      this.addField(field)
    }
    return this
  }
}
