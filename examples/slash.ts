import {
  Client,
  GatewayIntents,
  event,
  slash,
  ApplicationCommandInteraction,
  ApplicationCommandOptionType,
  isBotInVoiceChannel,
  isUserInVoiceChannel,
  customValidation
} from '../mod.ts'

export class MyClient extends Client {
  @event()
  async ready(): Promise<void> {
    console.log(`Logged in as ${this.user?.tag}!`)
    // Run this only when you're running this first time
    const commands = await this.interactions.commands.all()
    if (commands.size !== 4) {
      this.interactions.commands.bulkEdit([
        {
          name: 'ping',
          description: "It's literally ping command. What did you expect?",
          options: [
            {
              name: 'pingarg',
              description: 'Again literally pingArg',
              required: false,
              type: ApplicationCommandOptionType.STRING
            }
          ]
        },
        {
          name: 'hello',
          description: 'Is is nice to be greeted',
          options: [
            {
              name: 'target',
              description: 'Who are you greeting?',
              required: false,
              type: ApplicationCommandOptionType.STRING
            }
          ]
        },
        {
          name: 'join',
          description: 'Make me join the voice channel you are currently in'
        },
        {
          name: 'leave',
          description: 'Make me leave the current voice channel'
        }
      ])
    }
  }

  @slash()
  ping(d: ApplicationCommandInteraction): void {
    const arg = d.option<string | undefined>('pingarg')
    d.reply(`Pong! You typed: ${arg !== undefined ? arg : 'nothing'}`)
  }

  @slash()
  //Only allow this command if the user passed the parameter 'bot' or the bot's username
  @customValidation(
    (i) =>
      ['bot', i.client.user!.username].includes(i.option<string>('target')),
    '...'
  )
  hello(d: ApplicationCommandInteraction): void {
    d.reply(`Hello to you!!`)
  }

  @slash()
  //Only allow this command if the user is in a voice channel
  @isUserInVoiceChannel('You must be in a voice channel to use this command')
  async join(d: ApplicationCommandInteraction): Promise<void> {
    const vs = await d.guild!.voiceStates.get(d.user.id)
    const res = await vs?.channel?.join({ deaf: true })
    if (res === undefined) d.reply('Failed to join the voice channel')
    else d.reply('I joined the voice channel')
  }

  @slash()
  //Only allow this command if the bot is in a voice channel
  @isBotInVoiceChannel("I'm not in a voice channel")
  async leave(d: ApplicationCommandInteraction): Promise<void> {
    const vs = await d.guild!.voiceStates.get(d.client.user!.id)
    await vs?.channel?.leave()
    d.reply('I left the voice channel')
  }
}

console.log('Harmony - Slash Command Example')

const client = new MyClient()

const token = prompt('Input Bot Token:')
if (token === null) {
  console.log('No token provided')
  Deno.exit()
}

// You can also use Intents.None (all intents without priviliged ones, Intents.All has all of them)
// to not have to specify intents manually, but it is recommended to specify intents only which are needed!
// It makes your bot more memory efficient and uses less bandwidth.
client.connect(token, [
  GatewayIntents.GUILDS,
  GatewayIntents.GUILD_VOICE_STATES
])
