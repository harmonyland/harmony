import { Command, CommandClient, Intents } from "../../mod.ts";
import { GuildChannel } from "../managers/guildChannels.ts";
import { CommandContext } from "../models/command.ts";
import { Extension } from "../models/extensions.ts";
import { Member } from "../structures/member.ts";
import { Message } from "../structures/message.ts";
import { Role } from "../structures/role.ts";
import { MessageDeletePayload } from "../types/gateway.ts";
import { TOKEN } from "./config.ts";
import { Invite } from "../structures/invite.ts";

const client = new CommandClient({
  prefix: ["pls", "!"],
  spacesAfterPrefix: true,
  mentionPrefix: true,
});

client.on("debug", console.log);

client.on("ready", () => {
  console.log(`[Login] Logged in as ${client.user?.tag}!`);
});

client.on("messageDelete", (msg: Message) => {
  console.log(`Message Deleted: ${msg.id}, ${msg.author.tag}, ${msg.content}`);
});

client.on("messageDeleteUncached", (d: MessageDeletePayload) => {
  console.log(`Uncached Message Deleted: ${d.id} in ${d.channel_id}`);
});

client.on("messageUpdate", (before: Message, after: Message) => {
  console.log("Message Update");
  console.log(`Before: ${before.author.tag}: ${before.content}`);
  console.log(`After: ${after.author.tag}: ${after.content}`);
});

client.on("messageUpdateUncached", (msg: Message) => {
  console.log(`Message: ${msg.author.tag}: ${msg.content}`);
});

client.on("guildMemberAdd", (member: Member) => {
  console.log(`Member Join: ${member.user.tag}`);
});

client.on("guildMemberRemove", (member: Member) => {
  console.log(`Member Leave: ${member.user.tag}`);
});

client.on("guildRoleCreate", (role: Role) => {
  console.log(`Role Create: ${role.name}`);
});

client.on("guildRoleDelete", (role: Role) => {
  console.log(`Role Delete: ${role.name}`);
});

client.on("guildRoleUpdate", (role: Role, after: Role) => {
  console.log(`Role Update: ${role.name}, ${after.name}`);
});

client.on("inviteCreate", (invite: Invite) => {
  console.log(`Invite Create ${invite.code}`);
});

client.on("inviteDelete", (invite: Invite) => {
  console.log(invite);
  console.log(`Invite Delete ${invite.code}`);
});

// client.on('messageCreate', msg => console.log(`${msg.author.tag}: ${msg.content}`))

client.on("commandError", console.error);

class ChannelLog extends Extension {
  onChannelCreate(ext: Extension, channel: GuildChannel): void {
    console.log(`Channel Created: ${channel.name}`);
  }

  load(): void {
    this.listen("channelCreate", this.onChannelCreate);

    class Pong extends Command {
      name = "Pong";

      execute(ctx: CommandContext): any {
        ctx.message.reply("Ping!");
      }
    }

    this.commands.add(Pong);
  }
}

client.extensions.load(ChannelLog); // eslint-disable-next-line @typescript-eslint/no-floating-promises
(async () => {
  const files = Deno.readDirSync("./src/test/cmds");

  for (const file of files) {
    const module = await import(`./cmds/${file.name}`);
    // eslint-disable-next-line new-cap
    const cmd = new module.default();
    client.commands.add(cmd);
    console.log(`Loaded command ${cmd.name}!`);
  }

  console.log(`Loaded ${client.commands.count} commands!`);

  client.connect(TOKEN, Intents.All);
})();
