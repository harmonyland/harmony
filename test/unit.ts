/* eslint-disable spaced-comment */
// TODO: Add tests
import { Client, GatewayIntents as GI, Embed } from '../mod.ts'
import { TOKEN } from '../src/test/config.ts'
import { assertEquals, assertExists } from './deps.ts'

//#region Lib Tests
Deno.test({
  name: '[Lib] Embed',
  fn() {
    const embed = new Embed()
      .setTitle('Title')
      .setDescription('Description')
      .addField('F1N', 'F1V', false)
      .addField('F2N', 'F2V', true)
      .setColor(0xff0000)
      .setFooter('Footer', 'https://google.com')
      .setAuthor('Author', 'https://google.com')

    assertEquals(
      JSON.stringify(embed.toJSON()),
      `{"title":"Title","description":"Description","color":16711680,"footer":{"text":"Footer","icon_url":"https://google.com"},"author":{"name":"Author","icon_url":"https://google.com"},"fields":[{"name":"F1N","value":"F1V","inline":false},{"name":"F2N","value":"F2V","inline":true}]}`
    )
  }
})

//#endregion

//#region API Tests
const client = new Client({
  token: TOKEN,
  intents: [GI.GUILDS, GI.GUILD_MESSAGES, GI.DIRECT_MESSAGES]
})

await client.connect()
Deno.test({
  name: '[API] Client Ready',
  fn() {
    assertExists(client.user)
  }
})
//#endregion

Deno.test({
  name: '[API] Cleanup',
  fn() {
    setTimeout(() => {
      client.destroy()
      Deno.exit()
    }, 100)
  }
})
