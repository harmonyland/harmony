import { GatewayHandler } from "../../types/mod.ts";

const guildCreate: GatewayHandler<"GUILD_CREATE"> = async (
  client,
  [_, guild],
) => {
  client.guilds.set(guild.id, guild);

  const guildObj = client.guilds.get(guild.id)!;
  await guildObj.channels.fetchAll();

  client.emit("guildCreate", guildObj);
};

export default guildCreate;
