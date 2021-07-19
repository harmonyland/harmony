import { Args, parseArgs } from '../src/utils/command.ts'
import { assertEquals, assertNotEquals } from './deps.ts'

import type { Message } from '../mod.ts'

// Mocking of Client
class FakeClient {
  channels = {
    get: function (id: string) {
      return new FakeObj(id, 'channel')
    }
  }

  users = {
    get: function (id: string) {
      return new FakeObj(id, 'user')
    }
  }
}
// Mocking of User, Channel and Role
class FakeObj {
  mimicClass: 'channel' | 'user' | 'roles'
  id: string
  constructor(id: string, mimic: 'channel' | 'user' | 'roles') {
    this.id = id
    this.mimicClass = mimic
  }
}
// Mocking of Message
class FakeMessage {
  content: string
  client = new FakeClient()
  guild = {
    roles: {
      get: function (id: string) {
        return new FakeObj(id, 'roles')
      }
    }
  }

  constructor(content: string) {
    this.content = content
  }
}

// Command arguments needed for testing
// Used in test 1, 2 and 3
const commandArgs1: Args[] = [
  {
    name: 'originalMessage',
    match: 'content'
  },
  {
    name: 'permaban',
    match: 'flag',
    flag: '--permanent',
    defaultValue: true
  },
  {
    name: 'user',
    match: 'user'
  },
  {
    name: 'reason',
    match: 'rest',
    defaultValue: 'ree'
  }
]
// Used in test 4 and 5
const commandArgs2: Args[] = [
  {
    name: 'user',
    match: 'user'
  },
  {
    name: 'channel',
    match: 'channel'
  },
  {
    name: 'role',
    match: 'role'
  },
  {
    name: 'reason',
    match: 'rest',
    defaultValue: 'ree'
  }
]
// Used in test 6
const commandArgs3: Args[] = [
  {
    name: 'user',
    match: 'user'
  },
  {
    name: 'reason',
    match: 'rest',
    defaultValue: 'No reason provided'
  }
]
// Used in test 7
const commandArgs4: Args[] = [
  {
    name: 'user',
    match: 'user'
  },
  {
    name: 'subcommand',
    match: 'content',
    defaultValue: 'random',
    contentFilter: (x: string) => x === 'get'
  }
]

// TEST 1
const message1 = new FakeMessage(
  '<@!708544768342229012> --permanent bye bye Skyler'
)
const expectedResult1 = {
  originalMessage: [
    '<@!708544768342229012>',
    '--permanent',
    'bye',
    'bye',
    'Skyler'
  ],
  permaban: true,
  user: new FakeObj('708544768342229012', 'user'),
  reason: 'bye bye Skyler'
}
Deno.test({
  only: false,
  name: 'parse command arguments 1 (assertEquals)',
  fn: async () => {
    const result = await parseArgs(
      commandArgs1,
      message1.content.split(' '),
      message1 as unknown as Message
    )
    assertEquals(result, expectedResult1)
  },
  sanitizeOps: true,
  sanitizeResources: true,
  sanitizeExit: true
})

// TEST 2
const message2 = new FakeMessage('<@!708544768342229012> bye bye Skyler')
const expectedResult2 = {
  originalMessage: ['<@!708544768342229012>', 'bye', 'bye', 'Skyler'],
  permaban: true,
  user: new FakeObj('708544768342229012', 'user'),
  reason: 'bye bye Skyler'
}
Deno.test({
  name: 'parse command arguments 2 (assertEquals)',
  fn: async () => {
    const result = await parseArgs(
      commandArgs1,
      message2.content.split(' '),
      message2 as unknown as Message
    )
    assertEquals(result, expectedResult2)
  },
  sanitizeOps: true,
  sanitizeResources: true,
  sanitizeExit: true
})

// TEST 3
const message3 = new FakeMessage('<@!708544768342229012> bye bye Skyler')
const expectedResult3 = {
  originalMessage: ['<@!708544768342229012>', 'bye', 'bye', 'Skyler'],
  // Only permaban should be different!
  permaban: false,
  user: new FakeObj('708544768342229012', 'user'),
  reason: 'bye bye Skyler'
}
Deno.test({
  name: 'parse command arguments default value (assertNotEquals)',
  fn: async () => {
    const result = await parseArgs(
      commandArgs1,
      message3.content.split(' '),
      message3 as unknown as Message
    )
    // eslint-disable-next-line
    assertNotEquals(result!.permaban, expectedResult3.permaban)

    // This makes sure that only `expectedResult3.permaban` differs
    // eslint-disable-next-line
    assertEquals(result!.originalMessage, expectedResult3.originalMessage)
    // eslint-disable-next-line
    assertEquals(result!.user, expectedResult3.user)
    // eslint-disable-next-line
    assertEquals(result!.reason, expectedResult3.reason)
  },
  sanitizeOps: true,
  sanitizeResources: true,
  sanitizeExit: true
})

// TEST 4
const message4 = new FakeMessage(
  '<@!708544768342229012> bye <#783319033730564098> <@&836715188690092032>'
)
const expectedResult4 = {
  channel: new FakeObj('783319033730564098', 'channel'),
  role: new FakeObj('836715188690092032', 'roles'),
  user: new FakeObj('708544768342229012', 'user'),
  reason: 'bye'
}
Deno.test({
  name: 'parse command arguments mentions (assertEquals)',
  fn: async () => {
    const result = await parseArgs(
      commandArgs2,
      message4.content.split(' '),
      message4 as unknown as Message
    )
    assertEquals(result, expectedResult4)
  },
  sanitizeOps: true,
  sanitizeResources: true,
  sanitizeExit: true
})

// TEST 5
const message5 = new FakeMessage(
  '708544768342229012 bye 783319033730564098 836715188690092032'
)
Deno.test({
  name: "parse command arguments with ID's (assertEquals)",
  fn: async () => {
    const result = await parseArgs(
      commandArgs2,
      message5.content.split(' '),
      message5 as unknown as Message
    )
    assertEquals(result, expectedResult4)
  },
  sanitizeOps: true,
  sanitizeResources: true,
  sanitizeExit: true
})

// TEST 6
const message6 = new FakeMessage('<@!708544768342229012>')
const expectedResult6 = {
  user: new FakeObj('708544768342229012', 'user'),
  reason: 'No reason provided'
}
Deno.test({
  name: 'parse command arguments, rest match default',
  fn: async () => {
    const result = await parseArgs(
      commandArgs3,
      message6.content.split(' '),
      message6 as unknown as Message
    )
    assertEquals(result, expectedResult6)
  }
})

// TEST 7
const message7 = new FakeMessage('get <@!708544768342229012>')
const expectedResult7 = {
  user: new FakeObj('708544768342229012', 'user'),
  subcommand: ['get']
}
Deno.test({
  name: 'parse command arguments, match content filter',
  fn: async () => {
    const result = await parseArgs(
      commandArgs4,
      message7.content.split(' '),
      message7 as unknown as Message
    )
    assertEquals(result, expectedResult7)
  }
})
