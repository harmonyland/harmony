import { Gateway, GatewayEventHandler } from "../index.ts";
import { Guild } from "../../structures/guild.ts";
import { GuildPayload } from "../../types/guild.ts";
import { MembersManager } from "../../managers/members.ts";
import { GuildChannelPayload } from "../../types/channel.ts";
import { RolesManager } from "../../managers/roles.ts";

export const guildCreate: GatewayEventHandler = async (
  gateway: Gateway,
  d: GuildPayload,
) => {
  let guild: Guild | undefined = await gateway.client.guilds.get(d.id);
  if (guild !== undefined) {
    // It was just lazy load, so we don't fire the event as its gonna fire for every guild bot is in
    await gateway.client.guilds.set(d.id, d);

    if (d.members !== undefined) {
      const members = new MembersManager(gateway.client, guild);
      await members.fromPayload(d.members);
      guild.members = members;
    }

    if (d.channels !== undefined) {
      for (const ch of d.channels as GuildChannelPayload[]) {
        ch.guild_id = d.id;
        await gateway.client.channels.set(ch.id, ch);
      }
    }

    if (d.roles !== undefined) {
      const roles = new RolesManager(gateway.client, guild);
      await roles.fromPayload(d.roles);
      guild.roles = roles;
    }

    guild.refreshFromData(d);
  } else {
    await gateway.client.guilds.set(d.id, d);
    guild = new Guild(gateway.client, d);

    if (d.members !== undefined) {
      const members = new MembersManager(gateway.client, guild);
      await members.fromPayload(d.members);
      guild.members = members;
    }

    if (d.channels !== undefined) {
      for (const ch of d.channels as GuildChannelPayload[]) {
        ch.guild_id = d.id;
        await gateway.client.channels.set(ch.id, ch);
      }
    }

    if (d.roles !== undefined) {
      const roles = new RolesManager(gateway.client, guild);
      await roles.fromPayload(d.roles);
      guild.roles = roles;
    }

    await guild.roles.fromPayload(d.roles);
    guild = new Guild(gateway.client, d);
    gateway.client.emit("guildCreate", guild);
  }
};
