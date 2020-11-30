import { Gateway, GatewayEventHandler } from "../index.ts";
import { Guild } from "../../structures/guild.ts";
import { InviteCreatePayload } from "../../types/gateway.ts";
import { ChannelPayload, GuildPayload, InvitePayload } from "../../../mod.ts";

export const inviteCreate: GatewayEventHandler = async (
  gateway: Gateway,
  d: InviteCreatePayload,
) => {
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const guild: Guild | undefined = await gateway.client.guilds.get(d.guild_id!);

  // Weird case, shouldn't happen
  if (guild === undefined) return;

  const cachedChannel = await guild.channels.get(d.channel_id);
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
  const cachedGuild: GuildPayload | undefined = d.guild_id === undefined
    ? undefined
    : await guild.client.guilds._get(d.guild_id);
  const dataConverted: InvitePayload = {
    code: d.code,
    guild: cachedGuild,
    channel: cachedChannel as ChannelPayload,
    inviter: d.inviter,
    target_user: d.target_user,
    target_user_type: d.target_user_type,
  };
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
  await guild.invites.set(d.code, dataConverted);
  const invite = await guild.invites.get(d.code);
  gateway.client.emit("inviteCreate", invite);
};
