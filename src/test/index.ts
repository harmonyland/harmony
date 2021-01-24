import {
  Client,
  Intents,
  Message,
  Member,
  Role,
  GuildChannels,
  Embed,
  Guild,
  EveryChannelTypes,
  ChannelTypes,
  GuildTextChannel
} from '../../mod.ts'
import { Collector } from '../models/collectors.ts'
import { MessageAttachment } from '../structures/message.ts'
import { TOKEN } from './config.ts'

const client = new Client({
  // clientProperties: {
  //   browser: 'Discord iOS'
  // }
  // bot: false,
  // cache: new RedisCacheAdapter({
  //   hostname: '127.0.0.1',
  //   port: 6379
  // }), // Defaults to in-memory Caching
  // shardCount: 2
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
      ?.map((c: GuildChannels, i: number) => {
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
  } else if (msg.content === '!wait_for') {
    msg.channel.send('Send anything!')
    const [receivedMsg] = await client.waitFor(
      'messageCreate',
      (message) => message.author.id === msg.author.id
    )

    msg.channel.send(`Received: ${receivedMsg?.content}`)
  } else if (msg.content.startsWith('!collect') === true) {
    let count = parseInt(msg.content.replace(/\D/g, ''))
    if (isNaN(count)) count = 5
    await msg.channel.send(`Collecting ${count} messages for 5s`)
    const coll = new Collector({
      event: 'messageCreate',
      filter: (m) => m.author.id === msg.author.id,
      deinitOnEnd: true,
      max: count,
      timeout: 5000
    })
    coll.init(client)
    coll.collect()
    coll.on('start', () => msg.channel.send('[COL] Started'))
    coll.on('end', () =>
      msg.channel.send(`[COL] Ended. Collected Size: ${coll.collected.size}`)
    )
    coll.on('collect', (msg) =>
      msg.channel.send(`[COL] Collect: ${msg.content}`)
    )
  } else if (msg.content === '!attach') {
    msg.channel.send({
      file: await MessageAttachment.load(
        'https://cdn.discordapp.com/emojis/626139395623354403.png?v=1'
      )
    })
  } else if (msg.content === '!textfile') {
    msg.channel.send({
      file: new MessageAttachment('hello.txt', 'hello world')
    })
  } else if (msg.content === '!join') {
    if (msg.member === undefined) return
    const vs = await msg.guild?.voiceStates.get(msg.member.id)
    if (typeof vs !== 'object') return
    vs.channel?.join()
  }
})

client.on('messageReactionRemove', (reaction, user) => {
  const msg = reaction.message

  // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
  if (reaction.me && reaction.emoji.getEmojiString === '🤔') {
    msg.removeReaction(reaction.emoji)
  }
})

client.connect(TOKEN, Intents.None)

// OLD: Was a way to reproduce reconnect infinite loop
// setTimeout(() => {
//   console.log('[DEBUG] Reconnect')
//   client.gateway?.reconnect()
// }, 1000 * 4)
