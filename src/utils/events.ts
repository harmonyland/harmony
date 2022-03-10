import { EventEmitter } from '../../deps.ts'

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
          this.off(event, eventFunc)
          resolve([])
        }, timeout)
      }
      const eventFunc = (...args: T[K]): void => {
        if (checkFunction(...args)) {
          resolve(args)
          this.off(event, eventFunc)
          if (timeoutID !== undefined) clearTimeout(timeoutID)
        }
      }
      this.on(event, eventFunc)
    })
  }
}
