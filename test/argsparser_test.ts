import { Args, parseArgs } from '../src/utils/command.ts'
import { assertEquals, assertNotEquals } from './deps.ts'

const commandArgs: Args[] = [
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

const messageArgs1: string[] = [
  '<@!708544768342229012>',
  '--permanent',
  'bye',
  'bye',
  'Skyler'
]
const expectedResult1 = {
  originalMessage: [
    '<@!708544768342229012>',
    '--permanent',
    'bye',
    'bye',
    'Skyler'
  ],
  permaban: true,
  user: '708544768342229012',
  reason: 'bye bye Skyler'
}

Deno.test({
  only: false,
  name: 'parse command arguments 1 (assertEquals)',
  fn: () => {
    const result = parseArgs(commandArgs, messageArgs1)
    assertEquals(result, expectedResult1)
  },
  sanitizeOps: true,
  sanitizeResources: true,
  sanitizeExit: true
})

const messageArgs2: string[] = [
  '<@!708544768342229012>',
  'bye',
  'bye',
  'Skyler'
]
const expectedResult2 = {
  originalMessage: ['<@!708544768342229012>', 'bye', 'bye', 'Skyler'],
  permaban: true,
  user: '708544768342229012',
  reason: 'bye bye Skyler'
}

Deno.test({
  name: 'parse command arguments 2 (assertEquals)',
  fn: () => {
    const result = parseArgs(commandArgs, messageArgs2)
    assertEquals(result, expectedResult2)
  },
  sanitizeOps: true,
  sanitizeResources: true,
  sanitizeExit: true
})

const messageArgs3: string[] = [
  '<@!708544768342229012>',
  'bye',
  'bye',
  'Skyler'
]
const expectedResult3 = {
  permaban: false,
  user: '708544768342229012',
  reason: 'bye bye Skyler'
}

Deno.test({
  name: 'parse command arguments default value (assertNotEquals)',
  fn: () => {
    const result = parseArgs(commandArgs, messageArgs3)
    assertNotEquals(result, expectedResult3)
  },
  sanitizeOps: true,
  sanitizeResources: true,
  sanitizeExit: true
})

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

const messageArgs4: string[] = [
  '<@!708544768342229012>',
  'bye',
  '<#783319033730564098>',
  '<@&836715188690092032>'
]
const expectedResult4 = {
  channel: '783319033730564098',
  role: '836715188690092032',
  user: '708544768342229012',
  reason: 'bye'
}

Deno.test({
  name: 'parse command arguments mentions (assertEquals)',
  fn: () => {
    const result = parseArgs(commandArgs2, messageArgs4)
    assertEquals(result, expectedResult4)
  },
  sanitizeOps: true,
  sanitizeResources: true,
  sanitizeExit: true
})

const messageArgs5: string[] = ['<@!708544768342229012>']
const expectedResult5 = {
  user: '708544768342229012',
  reason: 'No reason provided'
}
const commandArgs5: Args[] = [
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
Deno.test({
  name: 'parse command arguments, rest match default',
  fn: () => {
    const result = parseArgs(commandArgs5, messageArgs5)
    assertEquals(result, expectedResult5)
  }
})

// only ID testing
const messageArgs7: string[] = [
  '708544768342229012',
  'bye',
  '783319033730564098',
  '836715188690092032'
]
const expectedResult7 = {
  channel: '783319033730564098',
  role: '836715188690092032',
  user: '708544768342229012',
  reason: 'bye'
}
Deno.test({
  name: 'parse command arguments with ID\'s (assertEquals)',
  fn: () => {
    const result = parseArgs(commandArgs2, messageArgs7)
    assertEquals(result, expectedResult7)
  },
  sanitizeOps: true,
  sanitizeResources: true,
  sanitizeExit: true

const messageArgs6: string[] = ['get', '<@!708544768342229012>']
const expectedResult6 = {
  user: '708544768342229012',
  subcommand: ['get']
}
const commandArgs6: Args[] = [
  {
    name: 'user',
    match: 'mentionUser'
  },
  {
    name: 'subcommand',
    match: 'content',
    defaultValue: 'random',
    contentFilter: (x: string) => x === 'get'
  }
]

Deno.test({
  name: 'parse command arguments, match content filter',
  fn: () => {
    const result = parseArgs(commandArgs6, messageArgs6)
    assertEquals(result, expectedResult6)
  }
})
