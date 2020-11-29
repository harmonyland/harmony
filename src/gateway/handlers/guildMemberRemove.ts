import { Gateway, GatewayEventHandler } from "../index.ts";
import { Guild } from "../../structures/guild.ts";
import { User } from "../../structures/user.ts";
import { GuildMemberRemovePayload } from "../../types/gateway.ts";

export const guildMemberRemove: GatewayEventHandler = async (
  gateway: Gateway,
  d: GuildMemberRemovePayload,
) => {
  const guild: Guild | undefined = await gateway.client.guilds.get(d.guild_id);
  // Weird case, shouldn't happen
  if (guild === undefined) return;

  const member = await guild.members.get(d.user.id);
  await guild.members.delete(d.user.id);

  if (member !== undefined) gateway.client.emit("guildMemberRemove", member);
  else {
    const user = new User(gateway.client, d.user);
    gateway.client.emit("guildMemberRemoveUncached", user);
  }
};
