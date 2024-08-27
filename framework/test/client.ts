import { GatewayIntent } from "../../mod.ts";
import { Client, GuildChannel } from "../mod.ts";

const TOKEN = Deno.env.get("BOT_TOKEN");
if (!TOKEN) {
  throw new Error("No token provided");
}

const client = new Client(TOKEN, {
  intents: GatewayIntent.GUILDS | GatewayIntent.GUILD_MESSAGES,
});

client.on("guildCreate", (guild) => {
  console.log(guild.name);
});

client.on("messageCreate", (msg) => {
  if (msg.author.bot) return;
  console.log(msg.guild!.id);
  msg.channel?.send(`${msg.guild!.id}: ${msg.channel.id}`);
});

client.on("channelCreate", (channel) => {
  if (channel instanceof GuildChannel) {
    console.log(channel.name);
    console.log(client.channels.cache.size);
  }
});

client.on("channelDelete", (channel) => {
  if (channel instanceof GuildChannel) {
    console.log(channel.name);
    console.log(client.channels.cache.size);
  }
});

client.connect();
