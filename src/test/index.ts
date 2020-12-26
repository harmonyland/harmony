import {
  Client,
  Intents,
  Message,
  Member,
  Role,
  GuildChannel,
  Embed,
  Guild,
  EveryChannelTypes,
  ChannelTypes,
  GuildTextChannel
} from '../../mod.ts'
import { TOKEN } from './config.ts'

const client = new Client({
  // clientProperties: {
  //   browser: 'Discord iOS'
  // }
  // bot: false,
  // cache: new RedisCacheAdapter({
  //   hostname: '127.0.0.1',
  //   port: 6379
  // }) // Defaults to in-memory Caching
})

client.on('ready', () => {
  console.log(`[Login] Logged in as ${client.user?.tag}!`)
})

client.on('debug', console.log)

client.on('channelUpdate', (b: EveryChannelTypes, a: EveryChannelTypes) => {
  if (b.type === ChannelTypes.GUILD_TEXT) {
    const before = (b as unknown) as GuildTextChannel
    const after = (a as unknown) as GuildTextChannel
    before.send('', {
      embed: new Embed({
        title: 'Channel Update',
        description: `Name Before: ${before.name}\nName After: ${after.name}`
      })
    })
  }
})

client.on('messageCreate', async (msg: Message) => {
  if (msg.author.bot === true) return
  if (msg.stickers !== undefined) {
    console.log(
      `${msg.author.tag}: (Sticker)${msg.stickers.map(
        (sticker) => `Name: ${sticker.name}, Tags: ${sticker.tags}`
      )}`
    )
  } else {
    console.log(`${msg.author.tag}: ${msg.content}`)
  }
  if (msg.content === '!ping') {
    msg.reply(`Pong! Ping: ${client.ping}ms`)
  } else if (msg.content === '!members') {
    const col = await msg.guild?.members.array()
    const data = col
      ?.map((c: Member, i: number) => {
        return `${i + 1}. ${c.user.tag}`
      })
      .join('\n') as string
    msg.channel.send('Member List:\n' + data)
  } else if (msg.content === '!guilds') {
    const guilds = await msg.client.guilds.collection()
    msg.channel.send(
      'Guild List:\n' +
        (guilds
          .array()
          .map((c: Guild, i: number) => {
            return `${i + 1}. ${c.name} - ${c.memberCount} members`
          })
          .join('\n') as string)
    )
  } else if (msg.content === '!roles') {
    const col = await msg.guild?.roles.collection()
    const data = col
      ?.array()
      .map((c: Role, i: number) => {
        return `${i + 1}. ${c.name}`
      })
      .join('\n') as string
    msg.channel.send('Roles List:\n' + data)
  } else if (msg.content === '!channels') {
    const col = await msg.guild?.channels.array()
    const data = col
      ?.map((c: GuildChannel, i: number) => {
        return `${i + 1}. ${c.name}`
      })
      .join('\n') as string
    msg.channel.send('Channels List:\n' + data)
  } else if (msg.content === '!messages') {
    const col = await msg.channel.messages.array()
    const data = col
      ?.slice(-5)
      .map((c: Message, i: number) => {
        return `${i + 1}. ${c.content}`
      })
      .join('\n') as string
    msg.channel.send('Top 5 Message List:\n' + data)
  } else if (msg.content === '!editChannel') {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
    const channel = msg.channel as GuildTextChannel
    const newChannel = await channel.edit({
      name: 'gggg'
    })
    if (newChannel.name === 'gggg') {
      msg.channel.send('Done!')
    } else {
      msg.channel.send('Failed...')
    }
  } else if (msg.content === '!react') {
    msg.addReaction('🤔')
  }
})

client.on('messageReactionRemove', (reaction, user) => {
  const msg = reaction.message

  // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
  if (reaction.me && reaction.emoji.getEmojiString === '🤔') {
    msg.removeReaction(reaction.emoji)
  }
})

client.connect(TOKEN, Intents.All)

// OLD: Was a way to reproduce reconnect infinite loop
// setTimeout(() => {
//   console.log('[DEBUG] Reconnect')
//   client.gateway?.reconnect()
// }, 1000 * 4)
