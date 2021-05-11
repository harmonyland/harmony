import { GuildChannel } from './channel.ts'
import type {
  GuildCategoryChannelPayload,
  ModifyGuildCategoryChannelOption,
  ModifyGuildCategoryChannelPayload
} from '../types/channel.ts'
import { CHANNEL } from '../types/endpoint.ts'

export class CategoryChannel extends GuildChannel {
  readFromData(data: GuildCategoryChannelPayload): void {
    super.readFromData(data)
  }

  async edit(
    options?: ModifyGuildCategoryChannelOption
  ): Promise<CategoryChannel> {
    const body: ModifyGuildCategoryChannelPayload = {
      name: options?.name,
      position: options?.position,
      permission_overwrites: options?.permissionOverwrites,
      parent_id: options?.parentID
    }

    const resp = await this.client.rest.patch(CHANNEL(this.id), body)

    return new CategoryChannel(this.client, resp, this.guild)
  }
}
