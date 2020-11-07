import { CommandClient, Intents } from '../../mod.ts';
import PingCommand from "./cmds/ping.ts";
import UserinfoCommand from "./cmds/userinfo.ts";
import { TOKEN } from './config.ts'

const client = new CommandClient({
  prefix: ["pls", "!"],
  spacesAfterPrefix: true
})

client.on('debug', console.log)

client.on('ready', () => {
  console.log(`[Login] Logged in as ${client.user?.tag}!`)
})

client.on("commandError", console.log)

client.commands.add(PingCommand)
client.commands.add(UserinfoCommand)

client.connect(TOKEN, Intents.All)