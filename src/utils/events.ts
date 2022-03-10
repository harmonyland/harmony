/* eslint-disable @typescript-eslint/no-dynamic-delete */
/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable @typescript-eslint/no-floating-promises */

// #region https://raw.githubusercontent.com/denosaurs/event/2.0.0/mod.ts
// Copyright 2020-present the denosaurs team. All rights reserved. MIT license.

// I have made some small patches to make it work with DNT.
// TODO: should we upstream these changes?

// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
type Entry<E, K extends keyof E> = {
  name: K
  value: E[K]
}

export class EventEmitter<E extends Record<string, unknown[]>> {
  #listeners: {
    [K in keyof E]?: Array<{
      once: boolean
      cb: (...args: E[K]) => void
    }>
  } = {}

  #globalWriters: Array<WritableStreamDefaultWriter<Entry<E, keyof E>>> = []
  #onWriters: {
    [K in keyof E]?: Array<WritableStreamDefaultWriter<E[K]>>
  } = {}

  #limit: number

  /**
   * @param maxListenersPerEvent - if set to 0, no limit is applied. defaults to 10
   */
  constructor(maxListenersPerEvent?: number) {
    this.#limit = maxListenersPerEvent ?? 10
  }

  /**
   * Appends the listener to the listeners array of the corresponding eventName.
   * No checks are made if the listener was already added, so adding multiple
   * listeners will result in the listener being called multiple times.
   * If no listener is passed, it returns an asyncIterator which will fire
   * every time eventName is emitted.
   */
  on<K extends keyof E>(eventName: K, listener: (...args: E[K]) => void): this
  on<K extends keyof E>(eventName: K): AsyncIterableIterator<E[K]>
  on<K extends keyof E>(
    eventName: K,
    listener?: (...args: E[K]) => void
  ): this | AsyncIterableIterator<E[K]> {
    if (listener !== undefined) {
      if (this.#listeners[eventName] === undefined) {
        this.#listeners[eventName] = []
      }
      if (
        this.#limit !== 0 &&
        this.#listeners[eventName]!.length >= this.#limit
      ) {
        throw new TypeError(`Listeners limit reached: limit is ${this.#limit}`)
      }
      this.#listeners[eventName]!.push({
        once: false,
        cb: listener
      })
      return this
    } else {
      if (this.#onWriters[eventName] !== undefined) {
        this.#onWriters[eventName] = []
      }
      if (
        this.#limit !== 0 &&
        this.#onWriters[eventName]!.length >= this.#limit
      ) {
        throw new TypeError(`Listeners limit reached: limit is ${this.#limit}`)
      }

      const { readable, writable } = new TransformStream<E[K], E[K]>()
      this.#onWriters[eventName]!.push(writable.getWriter())
      return (
        readable as unknown as {
          [Symbol.asyncIterator]: () => AsyncIterableIterator<E[K]>
        }
      )[Symbol.asyncIterator]()
    }
  }

  /**
   * Adds a one-time listener function for the event named eventName.
   * The next time eventName is emitted, listener is called and then removed.
   * If no listener is passed, it returns a Promise that will resolve once
   * eventName is emitted.
   */
  once<K extends keyof E>(eventName: K, listener: (...args: E[K]) => void): this
  once<K extends keyof E>(eventName: K): Promise<E[K]>
  once<K extends keyof E>(
    eventName: K,
    listener?: (...args: E[K]) => void
  ): this | Promise<E[K]> {
    if (this.#listeners[eventName] === undefined) {
      this.#listeners[eventName] = []
    }
    if (
      this.#limit !== 0 &&
      this.#listeners[eventName]!.length >= this.#limit
    ) {
      throw new TypeError(`Listeners limit reached: limit is ${this.#limit}`)
    }
    if (listener !== undefined) {
      this.#listeners[eventName]!.push({
        once: true,
        cb: listener
      })
      return this
    } else {
      return new Promise((resolve) => {
        this.#listeners[eventName]!.push({
          once: true,
          cb: (...args) => resolve(args)
        })
      })
    }
  }

  /**
   * Removes the listener from eventName.
   * If no listener is passed, all listeners will be removed from eventName,
   * this includes async listeners.
   * If no eventName is passed, all listeners will be removed from the EventEmitter,
   * including the async iterator for the class
   */
  async off<K extends keyof E>(
    eventName?: K,
    listener?: (...args: E[K]) => void
  ): Promise<this> {
    if (eventName !== undefined) {
      if (listener !== undefined) {
        this.#listeners[eventName] = this.#listeners[eventName]?.filter(
          ({ cb }) => cb !== listener
        )
      } else {
        if (this.#onWriters[eventName] !== undefined) {
          for (const writer of this.#onWriters[eventName]!) {
            await writer.close()
          }
          delete this.#onWriters[eventName]
        }

        delete this.#listeners[eventName]
      }
    } else {
      for (const writers of Object.values(this.#onWriters) as Array<
        Array<WritableStreamDefaultWriter<E[K]>>
      >) {
        for (const writer of writers) {
          await writer.close()
        }
      }
      this.#onWriters = {}

      for (const writer of this.#globalWriters) {
        await writer.close()
      }

      this.#globalWriters = []
      this.#listeners = {}
    }
    return this
  }

  /**
   * Synchronously calls each of the listeners registered for the event named
   * eventName, in the order they were registered, passing the supplied
   * arguments to each.
   */
  async emit<K extends keyof E>(eventName: K, ...args: E[K]): Promise<void> {
    const listeners = this.#listeners[eventName]?.slice() ?? []
    for (const { cb, once } of listeners) {
      // eslint-disable-next-line standard/no-callback-literal
      cb(...args)

      if (once) {
        await this.off(eventName, cb)
      }
    }

    if (this.#onWriters[eventName] !== undefined) {
      for (const writer of this.#onWriters[eventName]!) {
        await writer.write(args)
      }
    }
    for (const writer of this.#globalWriters) {
      await writer.write({
        name: eventName,
        value: args
      })
    }
  }

  [Symbol.asyncIterator]<K extends keyof E>(): AsyncIterableIterator<
    { [V in K]: Entry<E, V> }[K]
  > {
    if (this.#limit !== 0 && this.#globalWriters.length >= this.#limit) {
      throw new TypeError(`Listeners limit reached: limit is ${this.#limit}`)
    }

    const { readable, writable } = new TransformStream<
      Entry<E, K>,
      Entry<E, K>
    >()
    this.#globalWriters.push(writable.getWriter())
    return (
      readable as unknown as {
        [Symbol.asyncIterator]: () => AsyncIterableIterator<
          { [V in K]: Entry<E, V> }[K]
        >
      }
    )[Symbol.asyncIterator]()
  }
}

// #endregion

export class HarmonyEventEmitter<
  T extends Record<string, unknown[]>
> extends EventEmitter<T> {
  constructor() {
    super(0)
  }

  /** Wait for an Event to fire with given condition. */
  async waitFor<K extends keyof T>(
    event: K,
    checkFunction: (...args: T[K]) => boolean = () => true,
    timeout?: number
  ): Promise<T[K] | []> {
    return await new Promise((resolve) => {
      let timeoutID: number | undefined
      if (timeout !== undefined) {
        timeoutID = setTimeout(() => {
          this.off(event, eventFunc).then(() => resolve([]))
        }, timeout)
      }
      const eventFunc = async (...args: T[K]): Promise<void> => {
        if (checkFunction(...args)) {
          resolve(args)
          await this.off(event, eventFunc)
          if (timeoutID !== undefined) clearTimeout(timeoutID)
        }
      }
      this.on(event, eventFunc)
    })
  }
}
