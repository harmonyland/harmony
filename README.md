![banner](https://cdn.discordapp.com/attachments/783319033730564098/783399012547035176/HarmonyBanner.png)

<p align=center><i><b>An easy to use Discord API Library for Deno</b></i></p>
<p align=center>
<img src="https://img.shields.io/badge/standard--readme-OK-green.svg?style=for-the-badge"/>
<a href=https://discord.gg/harmony>
  <img src="https://img.shields.io/discord/783319033205751809.svg?label=Discord&logo=Discord&colorB=7289da&style=for-the-badge" alt="Support">
 </a>
<a href="https://github.com/harmonyland/harmony/issues"><img alt="GitHub issues" src="https://img.shields.io/github/issues/harmonyland/harmony">
 </a>
<a href="https://github.com/harmonyland/harmony/network"><img alt="GitHub forks" src="https://img.shields.io/github/forks/harmonyland/harmony">
 </a>
<a href="https://github.com/harmonyland/harmony/stargazers"><img alt="GitHub stars" src="https://img.shields.io/github/stars/harmonyland/harmony">
 </a>
<a href="https://github.com/harmonyland/harmony/blob/main/LICENSE"><img alt="GitHub license" src="https://img.shields.io/github/license/harmonyland/harmony">
 </a>
</p>
<br>

- Lightweight and easy to use.
- Complete Object-Oriented approach.
- Slash Commands supported.
- Built-in Commands framework.
- Customizable Caching, with Redis support.
- Use `@decorators` to easily make things!
- Made with ❤️ in TypeScript.

## Table of Contents

- [Usage](#usage)
- [Docs](#docs)
- [Discord](#discord)
- [Maintainer](#maintainer)
- [Contributing](#contributing)
- [License](#license)

## Usage

You can import the package from https://deno.land/x/harmony/mod.ts (with latest version) or can add a version too, and raw GitHub URL (latest unpublished version) https://raw.githubusercontent.com/harmonyland/harmony/main/mod.ts too.

You can also check(not import) the module in https://nest.land/package/harmony (link for importing is in the site).

For a quick example, run this:

```bash
deno run --allow-net https://deno.land/x/harmony/examples/ping.ts
```

And input your bot's token.

Here is a small example of how to use harmony,

```ts
import {
  Client,
  Message,
  GatewayIntents
} from 'https://deno.land/x/harmony/mod.ts'

const client = new Client()

// Listen for event when client is ready (Identified through gateway / Resumed)
client.on('ready', () => {
  console.log(`Ready! User: ${client.user?.tag}`)
})

// Listen for event whenever a Message is sent
client.on('messageCreate', (msg: Message): void => {
  if (msg.content === '!ping') {
    msg.channel.send(`Pong! WS Ping: ${client.gateway.ping}`)
  }
})

// Connect to gateway
client.connect('super secret token comes here', [
  GatewayIntents.DIRECT_MESSAGES,
  GatewayIntents.GUILDS,
  GatewayIntents.GUILD_MESSAGES
])
```

Or with CommandClient!

```ts
import {
  CommandClient,
  Command,
  CommandContext,
  GatewayIntents
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
    ctx.message.reply(`pong! Ping: ${ctx.client.gateway.ping}ms`)
  }
}

client.commands.add(PingCommand)

// Connect to gateway
client.connect('super secret token comes here', [
  GatewayIntents.DIRECT_MESSAGES,
  GatewayIntents.GUILDS,
  GatewayIntents.GUILD_MESSAGES
])
```

Or with Decorators!

```ts
import {
  event,
  CommandClient,
  command,
  CommandContext,
  GatewayIntents
} from 'https://deno.land/x/harmony/mod.ts'

class MyClient extends CommandClient {
  constructor() {
    super({
      prefix: ['!', '!!'],
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

new MyClient().connect('super secret token comes here', [
  GatewayIntents.DIRECT_MESSAGES,
  GatewayIntents.GUILDS,
  GatewayIntents.GUILD_MESSAGES
])
```

## Docs

Documentation is available for `main` (branch) and `stable` (release).

- [Main](https://doc.deno.land/https/raw.githubusercontent.com/harmonyland/harmony/main/mod.ts)
- [Stable](https://doc.deno.land/https/deno.land/x/harmony/mod.ts)
- [Guide](https://harmony.mod.land)

## Discord

Found a bug or want support? Join our Discord Server!

[![Harmony Discord Server](https://discord.com/api/guilds/783319033205751809/widget.png?style=banner1)](https://discord.gg/harmony)

## Maintainer

[@Helloyunho](https://github.com/Helloyunho)

## Contributing

See [the contributing file](CONTRIBUTING.md)!

Pull Requests are accepted.

Small note: If editing the README, please conform to the [standard-readme](https://github.com/RichardLitt/standard-readme) specification.

## License

[MIT © 2020-2021 Harmonyland](LICENSE)

#### Made with ❤ by Harmonyland
