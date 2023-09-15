import { GatewayHandler } from "../../../types/mod.ts";
import { Guild } from "../../structures/guilds/guild.ts";

const guildCreate: GatewayHandler<"GUILD_CREATE"> = async (
  client,
  [_, guild],
) => {
  client.guilds.set(guild.id, guild);

  const guildObj = new Guild(client, guild);
  await guildObj.channels.fetchAll();

  client.emit("guildCreate", guildObj);
};

export default guildCreate;
