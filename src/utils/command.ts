import { MessageMentions } from "../structures/messageMentions.ts";
export type CommandArgumentMatchTypes = 'flag' | 'mention' | 'content' | 'rest'

export interface Args {
  name: string
  match: CommandArgumentMatchTypes
  // Still needs to be implemented
  // type?: unknown
  defaultValue?: string;
  flag?: string
}


export function parseArgs(
  commandArgs: Args[] | undefined,
  messageArgs: string[]
): Record<string, unknown> | null {
  if (commandArgs === undefined) return null
  const messageArgsNullableCopy: Array<string | null> = [...messageArgs]
  const args: Record<string, unknown> = {}
  for (const entry of commandArgs) {
    switch (entry.match) {
      case 'flag':
        parseFlags(args, entry, messageArgsNullableCopy)
        break
      case 'mention':
        parseMention(args, entry, messageArgsNullableCopy)
        break
      case 'content':
        parseContent(args, entry, messageArgs)
        break
      case 'rest':
        parseRest(args, entry, messageArgsNullableCopy)
        break
    }
  }
  return args
}

function parseFlags(
  args: Record<string, unknown>,
  entry: Args,
  argsNullable: Array<string | null>
): void {
  for (let i = 0; i < argsNullable.length; i++) {
    if (entry.flag === argsNullable[i]) {
      argsNullable[i] = null
      args[entry.name] = true
      break
    } else args[entry.name] = entry.defaultValue
  }
}

function parseMention(
  args: Record<string, unknown>,
  entry: Args,
  argsNullable: Array<string | null>
): void {
  const index = argsNullable.findIndex((x) => typeof x === 'string')
  const mention = MessageMentions.USER_MENTION.exec(argsNullable[index]!)![0]
  argsNullable[index] = null
  args[entry.name] = mention
}

function parseContent(
  args: Record<string, unknown>,
  entry: Args,
  argsNonNullable: Array<string | null>
): void {
  args[entry.name] =
    argsNonNullable.length !== 0 ? argsNonNullable : entry.defaultValue
}

function parseRest(
  args: Record<string, unknown>,
  entry: Args,
  argsNullable: Array<string | null>
): void {
  args[entry.name] = argsNullable.filter((x) => typeof x === 'string')
}
