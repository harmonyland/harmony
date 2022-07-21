import {
  CommandClient,
  event,
  Intents,
  command,
  CommandContext,
  Extension,
  CommandBuilder
} from '../mod.ts'
import { TOKEN } from './config.ts'

class MyClient extends CommandClient {
  constructor() {
    super({
      // /^!+/ is a regular expression that matches any amount of exclamation marks
      prefix: ['!', '!!', /!+/],
      caseSensitive: false
    })
  }

  @event()
  ready(): void {
    console.log(`Logged in as ${this.user?.tag}!`)
  }

  @command({ aliases: 'pong' })
  Ping(ctx: CommandContext): void {
    ctx.message.reply('Pong!')
  }
}

class VCExtension extends Extension {
  name = 'VC'
  subPrefix = 'vc'

  @command()
  async join(ctx: CommandContext): Promise<void> {
    const userVS = await ctx.guild?.voiceStates.get(ctx.author.id)
    if (userVS === undefined) {
      ctx.message.reply("You're not in VC.")
      return
    }
    await userVS.channel?.join()
    ctx.message.reply(`Joined VC channel - ${userVS.channel?.name}!`)
  }

  @command()
  async leave(ctx: CommandContext): Promise<void> {
    const userVS = await ctx.guild?.voiceStates.get(
      ctx.client.user?.id as unknown as string
    )
    if (userVS === undefined) {
      ctx.message.reply("I'm not in VC.")
      return
    }
    userVS.channel?.leave()
    ctx.message.reply(`Left VC channel - ${userVS.channel?.name}!`)
  }
}

const client = new MyClient()

client.extensions.load(VCExtension)

client.commands.add(
  new CommandBuilder()
    .setName('join')
    .onExecute((ctx) => ctx.message.reply('haha'))
)

client.connect(TOKEN, Intents.All)
