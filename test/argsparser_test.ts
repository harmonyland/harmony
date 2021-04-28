import { parseArgs, Args } from '../src/utils/command.ts'
import {
  assertEquals,
  assertNotEquals
} from 'https://deno.land/std@0.95.0/testing/asserts.ts'

// debugger
const commandArgs: Args[] = [
  {
    name: 'permaban',
    match: 'flag',
    flag: '--permanent',
    defaultValue: true
  },
  {
    name: 'user',
    match: 'mention'
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
  permaban: true,
  user: '708544768342229012',
  reason: ['bye', 'bye', 'Skyler']
}

Deno.test({
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
  permaban: true,
  user: '708544768342229012',
  reason: ['bye', 'bye', 'Skyler']
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
  reason: ['bye', 'bye', 'Skyler']
}

Deno.test({
  name: 'parse command arguments 3 (assertNotEquals)',
  fn: () => {
    const result = parseArgs(commandArgs, messageArgs3)
    assertNotEquals(result, expectedResult3)
  },
  sanitizeOps: true,
  sanitizeResources: true,
  sanitizeExit: true
})
