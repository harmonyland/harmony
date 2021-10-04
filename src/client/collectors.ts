import { Collection } from '../utils/collection.ts'
import type { Client } from '../client/client.ts'
import { HarmonyEventEmitter } from '../utils/events.ts'

// Note: need to keep anys here for compatibility

export type CollectorFilter = (...args: any[]) => boolean | Promise<boolean>

export interface CollectorOptions {
  /** Event name to listen for */
  event: string
  /** Optionally Client object for deinitOnEnd functionality */
  client?: Client
  /** Filter function */
  filter?: CollectorFilter
  /** Max entries to collect */
  max?: number
  /** Whether or not to de-initialize on end */
  deinitOnEnd?: boolean
  /** Timeout to end the Collector if not fulfilled if any filter or max */
  timeout?: number
}

// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
export type CollectorEvents = {
  start: []
  end: []
  collect: any[]
}

export class Collector<
  T extends unknown[] = any[]
> extends HarmonyEventEmitter<CollectorEvents> {
  client?: Client
  private _started: boolean = false
  event: string
  filter: CollectorFilter = () => true
  collected: Collection<string, T> = new Collection()
  max?: number
  deinitOnEnd: boolean = false
  timeout?: number
  private _timer?: number

  get started(): boolean {
    return this._started
  }

  set started(d: boolean) {
    if (d !== this._started) {
      this._started = d
      if (d) this.emit('start')
      else {
        if (this.deinitOnEnd && this.client !== undefined)
          this.deinit(this.client)
        this.emit('end')
      }
    }
  }

  constructor(options: CollectorOptions | string) {
    super()
    if (typeof options === 'string') this.event = options
    else {
      this.event = options.event
      this.client = options.client
      this.filter = options.filter ?? (() => true)
      this.max = options.max
      this.deinitOnEnd = options.deinitOnEnd ?? false
      this.timeout = options.timeout
    }
  }

  /** Start collecting */
  collect(): this {
    this.started = true
    if (this.client !== undefined) this.init(this.client)
    if (this._timer !== undefined) clearTimeout(this._timer)
    if (this.timeout !== undefined) {
      this._timer = setTimeout(() => {
        this.end()
      }, this.timeout)
    }
    return this
  }

  /** End collecting */
  end(): this {
    this.started = false
    if (this._timer !== undefined) clearTimeout(this._timer)
    return this
  }

  /** Reset collector and start again */
  reset(): this {
    this.collected = new Collection()
    this.collect()
    return this
  }

  /** Init the Collector on Client */
  init(client: Client): this {
    this.client = client
    client.addCollector(this)
    return this
  }

  /** De initialize the Collector i.e. remove cleanly */
  deinit(client: Client): this {
    client.removeCollector(this)
    return this
  }

  /** Checks we may want to perform on an extended version of Collector */
  protected check(..._args: T): boolean | Promise<boolean> {
    return true
  }

  /** Fire the Collector */
  async _fire(...args: T): Promise<void> {
    if (!this.started) return
    const check = await this.check(...args)
    if (!check) return
    const filter = await this.filter(...args)
    if (!filter) return
    this.collected.set((Number(this.collected.size) + 1).toString(), args)
    this.emit('collect', ...args)
    if (
      this.max !== undefined &&
      // linter: send help
      this.max < Number(this.collected.size) + 1
    ) {
      this.end()
    }
  }

  /** Set filter of the Collector */
  when(filter: CollectorFilter): this {
    this.filter = filter
    return this
  }

  /** Add a new listener for 'collect' event */
  each(handler: CallableFunction): this {
    this.on('collect', () => handler())
    return this
  }

  /** Returns a Promise resolved when Collector ends or a timeout occurs */
  async wait(timeout?: number): Promise<this> {
    if (timeout === undefined) timeout = this.timeout ?? 0
    return await new Promise((resolve, reject) => {
      // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
      if (!timeout)
        throw new Error(
          'Timeout is required parameter if not given in CollectorOptions'
        )

      let done = false
      const onend = (): void => {
        done = true
        this.off('end', onend)
        resolve(this)
      }

      this.on('end', onend)
      setTimeout(() => {
        if (!done) {
          this.off('end', onend)
          reject(new Error('Timeout'))
        }
      }, timeout)
    })
  }
}
