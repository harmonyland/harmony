import { Gateway, GatewayEventHandler } from "../index.ts";
import { Guild } from "../../structures/guild.ts";
import { InviteCreatePayload } from "../../types/gateway.ts";

export const inviteCreate: GatewayEventHandler = async (
  gateway: Gateway,
  d: InviteCreatePayload,
) => {
  const guild: Guild | undefined = await gateway.client.guilds.get(d.guild_id!);
  // Weird case, shouldn't happen
  if (guild === undefined) return;

  console.log(d);
  console.log(guild.invites);
  await guild.invites.set(d.code, d.payload);
  const invite = await guild.invites.get(d.code);
  gateway.client.emit("inviteCreate", invite);
};
