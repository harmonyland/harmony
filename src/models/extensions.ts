import { Collection } from '../utils/collection.ts'
import { Command } from './command.ts'
import { CommandClient } from './commandClient.ts'

export type ExtensionEventCallback = (ext: Extension, ...args: any[]) => any

export class ExtensionCommands {
  extension: Extension

  constructor(ext: Extension) {
    this.extension = ext
  }

  get list(): Collection<string, Command> {
    return this.extension.client.commands.list.filter(
      (c) => c.extension?.name === this.extension.name
    )
  }

  get(cmd: string): Command | undefined {
    const find = this.extension.client.commands.find(cmd)
    // linter sucks
    if (find === undefined) return undefined
    else if (find.extension === undefined) return undefined
    else if (find.extension.name !== this.extension.name) return undefined
    else return find
  }

  add(Cmd: Command | typeof Command): boolean {
    const cmd = Cmd instanceof Command ? Cmd : new Cmd()
    cmd.extension = this.extension
    return this.extension.client.commands.add(cmd)
  }

  delete(cmd: Command | string): boolean {
    const find = this.extension.client.commands.find(
      typeof cmd === 'string' ? cmd : cmd.name
    )
    if (find === undefined) return false
    if (
      find.extension !== undefined &&
      find.extension.name !== this.extension.name
    ) {
      return false
    } else return this.extension.client.commands.delete(find)
  }

  deleteAll(): void {
    for (const [cmd] of this.list) {
      this.delete(cmd)
    }
  }
}

export class Extension {
  client: CommandClient
  name: string = ''
  description?: string
  commands: ExtensionCommands = new ExtensionCommands(this)
  events: { [name: string]: (...args: any[]) => {} } = {}

  constructor(client: CommandClient) {
    this.client = client
  }

  listen(event: string, cb: ExtensionEventCallback): boolean {
    if (this.events[event] !== undefined) return false
    else {
      const fn = (...args: any[]): any => {
        // eslint-disable-next-line standard/no-callback-literal
        cb(this, ...args)
      }
      this.client.on(event, fn)
      this.events[event] = fn
      return true
    }
  }

  load(): any {}
  unload(): any {}
}

export class ExtensionsManager {
  client: CommandClient
  list: Collection<string, Extension> = new Collection()

  constructor(client: CommandClient) {
    this.client = client
  }

  get(ext: string): Extension | undefined {
    return this.list.get(ext)
  }

  exists(ext: string): boolean {
    return this.get(ext) !== undefined
  }

  load(ext: Extension | typeof Extension): void {
    // eslint-disable-next-line new-cap
    if (!(ext instanceof Extension)) ext = new ext(this.client)
    if (this.exists(ext.name)) {
      throw new Error(`Extension with name '${ext.name}' already exists`)
    }
    this.list.set(ext.name, ext)
    ext.load()
  }

  unload(ext: Extension | string): boolean {
    const name = typeof ext === 'string' ? ext : ext.name
    const extension = this.get(name)
    if (extension === undefined) return false
    extension.commands.deleteAll()
    for (const [k, v] of Object.entries(extension.events)) {
      this.client.removeListener(k, v)
      // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
      delete extension.events[k]
    }
    extension.unload()
    return this.list.delete(name)
  }
}
