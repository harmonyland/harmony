import { Client, GuildTextChannel, GatewayIntents, Message, DefaultCacheAdapter, ClientPresence, Member, Role, GuildChannel, TextChannel, Embed, Guild } from '../../mod.ts';
import { Intents } from "../utils/intents.ts";
import { TOKEN } from './config.ts'

const client = new Client({
  presence: new ClientPresence({
    activity: {
      name: "Pokémon Sword",
      type: 'COMPETING'
    }
  }),
})

client.setAdapter(new DefaultCacheAdapter(client))

client.on('ready', () => {
  console.log(`[Login] Logged in as ${client.user?.tag}!`)
})

client.on('debug', console.log)

client.on('channelPinsUpdate', (before: TextChannel, after: TextChannel) => {
  console.log(before.send('', {
    embed: new Embed({
      title: 'Test',
      description: 'Test Embed'
    })
  }))
})

client.on('channelUpdate', (before: GuildTextChannel, after: GuildTextChannel) => {
  console.log(before.send('', {
    embed: new Embed({
      title: 'Channel Update',
      description: `Name Before: ${before.name}\nName After: ${after.name}`
    })
  }))
})

client.on('messageCreate', async (msg: Message) => {
  if (msg.author.bot === true) return
  if (msg.content === "!ping") {
    msg.reply(`Pong! Ping: ${client.ping}ms`)
  } else if (msg.content === "!members") {
    const col = await msg.guild?.members.collection()
    const data = col?.array().map((c: Member, i: number) => {
      return `${i + 1}. ${c.user.tag}`
    }).join("\n") as string
    msg.channel.send("Member List:\n" + data)
  } else if (msg.content === "!guilds") {
    const guilds = await msg.client.guilds.collection()
    msg.channel.send("Guild List:\n" + (guilds.array().map((c: Guild, i: number) => {
      return `${i + 1}. ${c.name} - ${c.memberCount} members`
    }).join("\n") as string))
  } else if (msg.content === "!roles") {
    const col = await msg.guild?.roles.collection()
    const data = col?.array().map((c: Role, i: number) => {
      return `${i + 1}. ${c.name}`
    }).join("\n") as string
    msg.channel.send("Roles List:\n" + data)
  } else if (msg.content === "!channels") {
    const col = await msg.guild?.channels.array()
    const data = col?.map((c: GuildChannel, i: number) => {
      return `${i + 1}. ${c.name}`
    }).join("\n") as string
    msg.channel.send("Channels List:\n" + data)
  }
})

client.connect(TOKEN, Intents.All)
