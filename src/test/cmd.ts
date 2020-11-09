import { CommandClient, Intents } from '../../mod.ts'
import { TOKEN } from './config.ts'

const client = new CommandClient({
  prefix: ["pls", "!"],
  spacesAfterPrefix: true,
  mentionPrefix: true
})

client.on('debug', console.log)

client.on('ready', () => {
  console.log(`[Login] Logged in as ${client.user?.tag}!`)
  client.rest.get('https://discord.com/api/v8/users/123')
})

client.on('messageCreate', msg => console.log(`${msg.author.tag}: ${msg.content}`))

client.on("commandError", console.error)

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