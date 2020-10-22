import { Client } from '../models/client.ts'
import { ChannelPayload, ChannelTypes } from '../types/channelTypes.ts'
import { Base } from './base.ts'
import { PrivateChannel } from './dm.ts'
import { TextChannel } from './textChannel.ts'

export class Channel extends Base {
  type: ChannelTypes
  id: string

  constructor (client: Client, data: ChannelPayload) {
    super(client)
    this.type = data.type
    this.id = data.id
  }

  get mention () {
    return `<#${this.id}>`
  }

  static from (data: ChannelPayload, client: Client) {
    switch (data.type) {
      case ChannelTypes.GUILD_TEXT:
        return new TextChannel(client, data)
      case ChannelTypes.DM:
        return new PrivateChannel(client, data)
    }
  }
}
