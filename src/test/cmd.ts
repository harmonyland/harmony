import { Command, CommandClient, Intents } from '../../mod.ts'
import { GuildChannel } from "../managers/guildChannels.ts"
import { CommandContext } from "../models/command.ts"
import { Extension } from "../models/extensions.ts"
import { Message } from "../structures/message.ts"
import { MessageDeletePayload } from "../types/gateway.ts"
import { TOKEN } from './config.ts'

const client = new CommandClient({
  prefix: ["pls", "!"],
  spacesAfterPrefix: true,
  mentionPrefix: true
})

client.on('debug', console.log)

client.on('ready', () => {
  console.log(`[Login] Logged in as ${client.user?.tag}!`)
})

client.on('messageDelete', (msg: Message) => {
  console.log(`Message Deleted: ${msg.id}, ${msg.author.tag}, ${msg.content}`)
})

client.on('messageDeleteUncached', (d: MessageDeletePayload) => {
  console.log(`Uncached Message Deleted: ${d.id} in ${d.channel_id}`)
})

// client.on('messageCreate', msg => console.log(`${msg.author.tag}: ${msg.content}`))

client.on("commandError", console.error)

class ChannelLog extends Extension {

  onChannelCreate(ext: Extension, channel: GuildChannel): void {
    console.log(`Channel Created: ${channel.name}`)
  }

  load(): void {
    this.listen('channelCreate', this.onChannelCreate)

    class Pong extends Command {
      name = 'Pong'

      execute(ctx: CommandContext): any {
        ctx.message.reply('Ping!')
      }
    }

    this.commands.add(Pong)
  }
}

client.extensions.load(ChannelLog)

// eslint-disable-next-line @typescript-eslint/no-floating-promises
;(async() => {
  const files = Deno.readDirSync('./src/test/cmds')

  for (const file of files) {
    const module = await import(`./cmds/${file.name}`)
    // eslint-disable-next-line new-cap
    const cmd = new module.default()
    client.commands.add(cmd)
    console.log(`Loaded command ${cmd.name}!`)
  }

  console.log(`Loaded ${client.commands.count} commands!`)

  client.connect(TOKEN, Intents.All)
})()