# harmony

![banner](banner.png)

[![standard-readme compliant](https://img.shields.io/badge/standard--readme-OK-green.svg?style=flat-square)](https://github.com/RichardLitt/standard-readme)

**An easy to use Discord API Library for Deno.**
* Lightweight and easy to use.
* Built-in Command Framework,
  * Easily build Commands on the fly.
  * Compltely Customizable.
  * Complete Object-Oriented approach.
* 100% Discord API Coverage.
* Customizable caching.
  * Built in support for Redis.
  * Write Custom Cache Adapters.
* Complete TypeScript support.

Note: Library is yet under development and not completely usable. You're still always welcome to use, but there may be breaking changes.

## Table of Contents

- [Usage](#usage)
- [Docs](#docs)
- [Maintainer](#maintainer)
- [Contributing](#contributing)
- [License](#license)

## Usage
Right now, the package is not published anywhere, as its not completely usable.
You can import it from this Raw GitHub URL: https://raw.githubusercontent.com/harmony-org/harmony/main/mod.ts

For a quick example, run this:
```bash
deno run --allow-net https://raw.githubusercontent.com/harmony-org/harmony/main/examples/ping.ts
```
And input your bot's token and Intents.

Here is a small example of how to use harmony,
```ts
import { Client, Message, Intents } from 'https://raw.githubusercontent.com/harmony-org/harmony/main/mod.ts'

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
// Replace with your bot's token and intents (Intents.All, Intents.Presence, Intents.GuildMembers)
client.connect('super secret token comes here', Intents.All)
```

Or with CommandClient!
```ts
import { CommandClient, Command, CommandContext, Message, Intents } from 'https://raw.githubusercontent.com/harmony-org/harmony/main/mod.ts'

const client = new CommandClient({
  prefix: '!'
})

// Listen for event when client is ready (Identified through gateway / Resumed)
client.on('ready', () => {
  console.log(`Ready! User: ${client.user?.tag}`)
})

// Create a new Command
class PingCommand extends Command {
  name = "ping"

  execute(ctx: CommandContext) {
    ctx.message.reply(`pong! Ping: ${ctx.client.ping}ms`)
  }
}

client.commands.add(PingCommand)

// Connect to gateway
// Replace with your bot's token and intents (Intents.All, Intents.Presence, Intents.GuildMembers)
client.connect('super secret token comes here', Intents.All)
```

## Docs

Not made yet.

## Maintainer

[@Helloyunho](https://github.com/Helloyunho)

## Contributing

See [the contributing file](CONTRIBUTING.md)!

PRs are accepted.

Small note: If editing the README, please conform to the [standard-readme](https://github.com/RichardLitt/standard-readme) specification.

## License

[MIT © 2020 Helloyunho](LICENSE)
