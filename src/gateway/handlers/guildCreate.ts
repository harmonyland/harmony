import { Gateway, GatewayEventHandler } from '../index.ts'
import { Guild } from '../../structures/guild.ts'
import { GuildPayload, MemberPayload } from "../../types/guild.ts"
import { MembersManager } from "../../managers/MembersManager.ts"
import { ChannelPayload } from "../../types/channel.ts"
import { RolePayload } from "../../types/role.ts"
import { RolesManager } from "../../managers/RolesManager.ts"

export const guildCreate: GatewayEventHandler = async(gateway: Gateway, d: GuildPayload) => {
  let guild: Guild | void = await gateway.client.guilds.get(d.id)
  if (guild !== undefined) {
    // It was just lazy load, so we don't fire the event as its gonna fire for every guild bot is in
    await gateway.client.guilds.set(d.id, d)
    if((d as GuildPayload).members) {
      let members = new MembersManager(gateway.client, guild)
      await members.fromPayload((d as GuildPayload).members as MemberPayload[])
      guild.members = members
    }
    if((d as GuildPayload).channels) {
      for (let ch of (d as GuildPayload).channels as ChannelPayload[]) {
        (ch as any).guild_id = d.id
        await gateway.client.channels.set(ch.id, ch)
      }
    }
    if((d as GuildPayload).roles) {
      let roles = new RolesManager(gateway.client, guild)
      await roles.fromPayload((d as GuildPayload).roles as RolePayload[])
      guild.roles = roles
    }
    guild.refreshFromData(d)
  } else {
    await gateway.client.guilds.set(d.id, d)
    guild = new Guild(gateway.client, d as GuildPayload)
    if((d as GuildPayload).members) {
      let members = new MembersManager(gateway.client, guild)
      await members.fromPayload((d as GuildPayload).members as MemberPayload[])
      guild.members = members
    }
    if((d as GuildPayload).channels) {
      for (let ch of (d as GuildPayload).channels as ChannelPayload[]) {
        await gateway.client.channels.set(ch.id, ch)
      }
    }
    if((d as GuildPayload).roles) {
      let roles = new RolesManager(gateway.client, guild)
      await roles.fromPayload((d as GuildPayload).roles as RolePayload[])
      guild.roles = roles
    }
    await guild.roles.fromPayload(d.roles)
    gateway.client.emit('guildCreate', guild)
  }
}
