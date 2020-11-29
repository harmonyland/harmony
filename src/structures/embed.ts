import {
  EmbedAuthor,
  EmbedField,
  EmbedFooter,
  EmbedImage,
  EmbedPayload,
  EmbedProvider,
  EmbedThumbnail,
  EmbedTypes,
  EmbedVideo,
} from "../types/channel.ts";

export class Embed {
  title?: string;
  type?: EmbedTypes;
  description?: string;
  url?: string;
  timestamp?: string;
  color?: number;
  footer?: EmbedFooter;
  image?: EmbedImage;
  thumbnail?: EmbedThumbnail;
  video?: EmbedVideo;
  provider?: EmbedProvider;
  author?: EmbedAuthor;
  fields?: EmbedField[];

  constructor(data?: EmbedPayload) {
    this.title = data?.title;
    this.type = data?.type;
    this.description = data?.description;
    this.url = data?.url;
    this.timestamp = data?.timestamp;
    this.color = data?.color;
    this.footer = data?.footer;
    this.image = data?.image;
    this.thumbnail = data?.thumbnail;
    this.video = data?.video;
    this.provider = data?.provider;
    this.author = data?.author;
    this.fields = data?.fields;
  }

  // khk4912
  toJSON(): EmbedPayload {
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
      fields: this.fields,
    };
  }

  setTitle(title: string): Embed {
    this.title = title;
    return this;
  }

  setDescription(description: string): Embed {
    this.description = description;
    return this;
  }

  setType(type: EmbedTypes): Embed {
    this.type = type;
    return this;
  }

  setURL(url: string): Embed {
    this.url = url;
    return this;
  }

  setTimestamp(timestamp: string): Embed {
    this.timestamp = timestamp;
    return this;
  }

  setColor(hex: number): Embed {
    this.color = hex;
    return this;
  }

  setFooter(footer: EmbedFooter): Embed {
    this.footer = footer;
    return this;
  }

  setImage(image: EmbedImage): Embed {
    this.image = image;
    return this;
  }

  setThumbnail(thumbnail: EmbedThumbnail): Embed {
    this.thumbnail = thumbnail;
    return this;
  }

  setVideo(video: EmbedVideo): Embed {
    this.video = video;
    return this;
  }

  setProvider(provider: EmbedProvider): Embed {
    this.provider = provider;
    return this;
  }

  setAuthor(author: EmbedAuthor): Embed {
    this.author = author;
    return this;
  }

  setFields(fields: EmbedField[]): Embed {
    this.fields = fields;
    return this;
  }

  addField(name: string, value: string, inline?: boolean): Embed {
    if (this.fields === undefined) {
      this.fields = [
        {
          name: name,
          value: value,
          inline: inline,
        },
      ];
    } else {
      this.fields.push({
        name: name,
        value: value,
        inline: inline,
      });
    }

    return this;
  }
}
