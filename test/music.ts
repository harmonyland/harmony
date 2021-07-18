import {
  CommandClient,
  event,
  Intents,
  command,
  subslash,
  groupslash,
  CommandContext,
  Extension,
  Collection,
  GuildTextChannel,
  slash,
  SlashCommandInteraction
} from '../mod.ts'
import { LL_IP, LL_PASS, LL_PORT, TOKEN } from './config.ts'
import { Manager, Player } from 'https://deno.land/x/lavadeno/mod.ts'
// import { SlashCommandOptionType } from '../types/slash.ts'

export const nodes = [
  {
    id: 'main',
    host: LL_IP,
    port: LL_PORT,
    password: LL_PASS
  }
]

class MyClient extends CommandClient {
  manager: Manager

  constructor() {
    super({
      prefix: ['.'],
      caseSensitive: false
    })

    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const client = this

    this.manager = new Manager(nodes, {
      send(id, payload) {
        // Sharding not added yet
        client.gateway?.send(payload)
      }
    })

    this.manager.on('socketError', ({ id }, error) =>
      console.error(`${id} ran into an error`, error)
    )
    this.manager.on('socketReady', (node) =>
      console.log(`${node.id} connected.`)
    )

    this.on('raw', (evt: string, d: any) => {
      if (evt === 'VOICE_SERVER_UPDATE') this.manager.serverUpdate(d)
      else if (evt === 'VOICE_STATE_UPDATE') this.manager.stateUpdate(d)
    })
  }

  @subslash('cmd', 'sub-cmd-no-grp')
  subCmdNoGroup(d: SlashCommandInteraction): void {
    d.respond({ content: 'sub-cmd-no-group worked' })
  }

  @groupslash('cmd', 'sub-cmd-group', 'sub-cmd')
  subCmdGroup(d: SlashCommandInteraction): void {
    d.respond({ content: 'sub-cmd-group worked' })
  }

  @command()
  rmrf(ctx: CommandContext): any {
    if (ctx.author.id !== '422957901716652033') return
    ;(ctx.channel as any as GuildTextChannel)
      .bulkDelete(3)
      .then((chan) => {
        ctx.channel.send(`Bulk deleted 2 in ${chan}`)
      })
      .catch((e) => ctx.channel.send(`${e.message}`))
  }

  @slash()
  run(d: SlashCommandInteraction): void {
    console.log(d.name)
  }

  @event()
  raw(evt: string, d: any): void {
    if (!evt.startsWith('APPLICATION')) return
    console.log(evt, d)
  }

  @event()
  ready(): void {
    console.log(`Logged in as ${this.user?.tag}!`)
    this.manager.init(this.user?.id as string)
    this.slash.commands.all().then(console.log)

    // this.rest.api.users['422957901716652033'].get().then(console.log)
    // client.slash.commands.create(
    //   {
    //     name: 'cmd',
    //     description: 'Parent command!',
    //     options: [
    //       {
    //         name: 'sub-cmd-group',
    //         type: SlashCommandOptionType.SUB_COMMAND_GROUP,
    //         description: 'Sub Cmd Group',
    //         options: [
    //           {
    //             name: 'sub-cmd',
    //             type: SlashCommandOptionType.SUB_COMMAND,
    //             description: 'Sub Cmd'
    //           }
    //         ]
    //       },
    //       {
    //         name: 'sub-cmd-no-grp',
    //         type: SlashCommandOptionType.SUB_COMMAND,
    //         description: 'Sub Cmd'
    //       },
    //       {
    //         name: 'sub-cmd-grp-2',
    //         type: SlashCommandOptionType.SUB_COMMAND_GROUP,
    //         description: 'Sub Cmd Group 2',
    //         options: [
    //           {
    //             name: 'sub-cmd-1',
    //             type: SlashCommandOptionType.SUB_COMMAND,
    //             description: 'Sub Cmd 1'
    //           },
    //           {
    //             name: 'sub-cmd-2',
    //             type: SlashCommandOptionType.SUB_COMMAND,
    //             description: 'Sub Cmd 2'
    //           }
    //         ]
    //       }
    //     ]
    //   },
    //   '783319033205751809'
    // )
    // client.slash.commands.delete('788719077329207296', '783319033205751809')
  }
}

const players = new Collection<string, Player>()

class VCExtension extends Extension {
  name = 'VC'
  subPrefix = 'vc'

  @command()
  async join(ctx: CommandContext): Promise<any> {
    if (players.has(ctx.guild?.id as string) === true)
      return ctx.message.reply(`Already playing in this server!`)

    ctx.argString = ctx.argString.slice(4).trim()

    if (ctx.argString === '')
      return ctx.message.reply('You gave nothing to search.')

    const userVS = await ctx.guild?.voiceStates.get(ctx.author.id)
    if (userVS === undefined) {
      ctx.message.reply("You're not in VC.")
      return
    }

    const player = (ctx.client as MyClient).manager.create(
      ctx.guild?.id as string
    )

    await player.connect(userVS.channel?.id as string, { selfDeaf: true })

    ctx.message.reply(`Joined VC channel - ${userVS.channel?.name}!`)

    players.set(ctx.guild?.id as string, player)

    ctx.channel.send(`Loading...`)

    ctx.channel.send(`Searching for ${ctx.argString}...`)

    const { track, info } = await player.manager
      .search(`ytsearch:${ctx.argString}`)
      .then((e) => e.tracks[0])

    await player.play(track)

    ctx.channel.send(`Now playing ${info.title}!\nDebug Track: ${track}`)
  }

  @command()
  async leave(ctx: CommandContext): Promise<any> {
    const userVS = await ctx.guild?.voiceStates.get(
      ctx.client.user?.id as unknown as string
    )
    if (userVS === undefined) {
      ctx.message.reply("I'm not in VC.")
      return
    }
    userVS.channel?.leave()
    ctx.message.reply(`Left VC channel - ${userVS.channel?.name}!`)

    if (players.has(ctx.guild?.id as string) !== true)
      return ctx.message.reply('Not playing anything in this server.')

    const player = players.get(ctx.guild?.id as string) as unknown as Player
    await player.stop()
    await player.destroy()

    players.delete(ctx.guild?.id as string)
    ctx.message.reply('Stopped player')
  }
}

const client = new MyClient()

client.on('raw', (e, d) => {
  if (e === 'GUILD_MEMBER_ADD' || e === 'GUILD_MEMBER_UPDATE') console.log(e, d)
})

client.extensions.load(VCExtension)

client.connect(TOKEN, Intents.All)
