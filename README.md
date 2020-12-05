![banner](https://cdn.discordapp.com/attachments/783319033730564098/783399012547035176/HarmonyBanner.png)

<p align=center><i><b>An easy to use Discord API Library for Deno</b></i></p>
<p align=center>
<img src="https://img.shields.io/badge/standard--readme-OK-green.svg?style=for-the-badge"/>
<a href=https://discord.gg/WVN2JF2FRv>
  <img src="https://img.shields.io/discord/783319033205751809.svg?label=Discord&logo=Discord&colorB=7289da&style=for-the-badge" alt="Support">
 </a>
</p>
<br>

- Lightweight and easy to use.
- Built-in Command Framework,
  - Easily build Commands on the fly.
  - Completely Customizable.
  - Complete Object-Oriented approach.
- 100% Discord API Coverage.
- Customizable caching.
  - Built in support for Redis.
  - Write Custom Cache Adapters.
- Complete TypeScript support.

## Table of Contents

- [Usage](#usage)
- [Docs](#docs)
- [Discord](#discord)
- [Maintainer](#maintainer)
- [Contributing](#contributing)
- [License](#license)

## Usage

You can import the package from https://deno.land/x/harmony/mod.ts (with latest version) or can add a version too, and raw GitHub URL (latest unpublished version) https://raw.githubusercontent.com/harmony-org/harmony/main/mod.ts too.

For a quick example, run this:

```bash
deno run --allow-net https://deno.land/x/harmony/examples/ping.ts
```

And input your bot's token and Intents.

Here is a small example of how to use harmony,

```ts
import { Client, Message, Intents } from 'https://deno.land/x/harmony/mod.ts'

const client = new Client()

// Listen for event when client is ready (Identified through gateway / Resumed)
client.on('ready', () => {
  console.log(`Ready! User: ${client.user?.tag}`)
})

// Listen for event whenever a Message is sent
client.on('messageCreate', (msg: Message): void => {
  if (msg.content === '!ping') {
    msg.channel.send(`Pong! WS Ping: ${client.ping}`)
  }
})

// Connect to gateway
// Replace with your bot's token and intents (Intents.All, Intents.None, Intents.Presence, Intents.GuildMembers)
client.connect('super secret token comes here', Intents.All)
```

Or with CommandClient!

```ts
import {
  CommandClient,
  Command,
  CommandContext,
  Message,
  Intents
} from 'https://deno.land/x/harmony/mod.ts'

const client = new CommandClient({
  prefix: '!'
})

// Listen for event when client is ready (Identified through gateway / Resumed)
client.on('ready', () => {
  console.log(`Ready! User: ${client.user?.tag}`)
})

// Create a new Command
class PingCommand extends Command {
  name = 'ping'

  execute(ctx: CommandContext) {
    ctx.message.reply(`pong! Ping: ${ctx.client.ping}ms`)
  }
}

client.commands.add(PingCommand)

// Connect to gateway
// Replace with your bot's token and intents (Intents.All, Intents.None, Intents.Presence, Intents.GuildMembers)
client.connect('super secret token comes here', Intents.All)
```

## Docs

Documentation is available for `main` (branch) and `stable` (release).

- [Main](https://doc.deno.land/https/raw.githubusercontent.com/harmony-org/harmony/main/mod.ts)
- [Stable](https://doc.deno.land/https/deno.land/x/harmony/mod.ts)

## Found a bug or want support? Join our discord server!

[![Widget for the Discord Server](https://discord.com/api/guilds/783319033205751809/widget.png?style=banner1)](https://discord.gg/WVN2JF2FRv)

## Maintainer

[@Helloyunho](https://github.com/Helloyunho)

## Contributing

See [the contributing file](CONTRIBUTING.md)!

Pull Requests are accepted.

Small note: If editing the README, please conform to the [standard-readme](https://github.com/RichardLitt/standard-readme) specification.

## License

[MIT © 2020 Harmony Org](LICENSE)

#### Made with ❤ by Harmony-org
