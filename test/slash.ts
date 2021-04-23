import { Client, Intents, event, slash } from '../mod.ts'
import { Interaction } from '../src/structures/slash.ts'
import { TOKEN } from './config.ts'

export class MyClient extends Client {
  @event() ready(): void {
    console.log(`Logged in as ${this.user?.tag}!`)
    // this.slash.commands.bulkEdit(
    //   [
    //     {
    //       name: 'test',
    //       description: 'Test command.',
    //       options: [
    //         {
    //           name: 'user',
    //           type: Type.USER,
    //           description: 'User'
    //         },
    //         {
    //           name: 'role',
    //           type: Type.ROLE,
    //           description: 'Role'
    //         },
    //         {
    //           name: 'channel',
    //           type: Type.CHANNEL,
    //           description: 'Channel'
    //         },
    //         {
    //           name: 'string',
    //           type: Type.STRING,
    //           description: 'String'
    //         }
    //       ]
    //     }
    //   ],
    //   '807935370556866560'
    // )
    // this.slash.commands.bulkEdit([])
  }

  @slash() test(d: Interaction): void {
    console.log(d.resolved)
  }

  @event() raw(evt: string, d: any): void {
    if (evt === 'INTERACTION_CREATE') console.log(evt, d?.data?.resolved)
  }
}

const client = new MyClient({
  presence: {
    status: 'dnd',
    activity: { name: 'Slash Commands', type: 'LISTENING' }
  }
})

client.connect(TOKEN, Intents.None)
