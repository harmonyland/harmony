import { Collection } from '../utils/collection.ts'
import { Command } from './command.ts'
import { CommandClient } from './client.ts'
import type { ClientEvents } from '../gateway/handlers/mod.ts'

export type ExtensionEventCallback = (ext: Extension, ...args: any[]) => any

/** Extension Commands Manager */
export class ExtensionCommands {
  extension: Extension

  constructor(ext: Extension) {
    this.extension = ext
  }

  /** Gets a list of Extension's Commands */
  get list(): Collection<string, Command> {
    return this.extension.client.commands.list.filter(
      (c) => c.extension?.name === this.extension.name
    )
  }

  /** Gets an Extension Command */
  get(cmd: string): Command | undefined {
    const find = this.extension.client.commands.find(cmd)
    // linter sucks
    if (find === undefined) return undefined
    else if (find.extension === undefined) return undefined
    else if (find.extension.name !== this.extension.name) return undefined
    else return find
  }

  /** Adds an Extension Command */
  add(Cmd: Command | typeof Command): boolean {
    const cmd = Cmd instanceof Command ? Cmd : new Cmd()
    cmd.extension = this.extension
    return this.extension.client.commands.add(cmd)
  }

  /** Deletes an Extension Command */
  delete(cmd: Command | string): boolean {
    const find = this.extension.client.commands.find(
      typeof cmd === 'string' ? cmd : cmd.name
    )
    if (find === undefined) return false
    if (
      find.extension !== undefined &&
      find.extension.name !== this.extension.name
    )
      return false
    else return this.extension.client.commands.delete(find)
  }

  /** Deletes all Commands of an Extension */
  deleteAll(): void {
    for (const [cmd] of this.list) {
      this.delete(cmd)
    }
  }
}

/** Customizable, isolated and pluggable Extensions are a great way of writing certain Modules independent of others */
export class Extension {
  client: CommandClient
  /** Name of the Extension */
  name = ''
  /** Description of the Extension */
  description?: string
  /** Extensions's Commands Manager */
  commands: ExtensionCommands = new ExtensionCommands(this)
  /** Sub-Prefix to be used for ALL of Extension's Commands. */
  subPrefix?: string
  /** Events registered by this Extension */
  events: Record<string, (...args: []) => void> = {};
  _decoratedCommands: Record<string, Command> | undefined
  _decoratedEvents: Record<string, ExtensionEventCallback> | undefined
  constructor(client: CommandClient) {
    this.client = client
    if (this._decoratedCommands !== undefined) {
      Object.entries(this._decoratedCommands).forEach((entry) => {
        entry[1].extension = this
        this.commands.add(entry[1])
      })
      this._decoratedCommands = undefined
    }

    if (
      this._decoratedEvents !== undefined &&
      Object.keys(this._decoratedEvents).length !== 0
    ) {
      Object.entries(this._decoratedEvents).forEach((entry) => {
        this.listen(entry[0] as keyof ClientEvents, entry[1].bind(this))
      })
      this._decoratedEvents = undefined
    }
  }

  /** Listens for an Event through Extension. */
  listen(event: keyof ClientEvents, cb: ExtensionEventCallback): boolean {
    if (this.events[event] !== undefined) return false
    else {
      const fn = (...args: unknown[]): void => {
        cb(this, ...args)
      }
      this.client.on(event, fn)
      this.events[event] = fn
      return true
    }
  }

  /** Method called upon loading of an Extension */
  load(): void {}
  /** Method called upon unloading of an Extension */
  unload(): void {}
}

/** Extensions Manager for CommandClient */
export class ExtensionsManager {
  client: CommandClient
  list: Collection<string, Extension> = new Collection()

  constructor(client: CommandClient) {
    this.client = client
  }

  /** Gets an Extension by name */
  get(ext: string): Extension | undefined {
    return this.list.get(ext)
  }

  /** Checks whether an Extension exists or not */
  exists(ext: string): boolean {
    return this.get(ext) !== undefined
  }

  /** Loads an Extension onto Command Client */
  load(ext: Extension | typeof Extension): void {
    if (!(ext instanceof Extension)) ext = new ext(this.client)
    if (this.exists(ext.name))
      throw new Error(`Extension with name '${ext.name}' already exists`)
    this.list.set(ext.name, ext)
    ext.load()
  }

  /** Unloads an Extension from Command Client */
  unload(ext: Extension | string): boolean {
    const name = typeof ext === 'string' ? ext : ext.name
    const extension = this.get(name)
    if (extension === undefined) return false
    extension.commands.deleteAll()
    for (const [k, v] of Object.entries(extension.events)) {
      this.client.off(k as keyof ClientEvents, v)
      delete extension.events[k]
    }
    extension.unload()
    return this.list.delete(name)
  }
}
