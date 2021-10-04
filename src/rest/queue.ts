// based on https://github.com/discordjs/discord.js/blob/master/src/rest/AsyncQueue.js

export interface RequestPromise {
  resolve: CallableFunction
  promise: Promise<unknown>
}

export class RequestQueue {
  promises: RequestPromise[] = []

  get remaining(): number {
    return this.promises.length
  }

  async wait(): Promise<unknown> {
    const next =
      this.promises.length !== 0
        ? this.promises[this.promises.length - 1].promise
        : Promise.resolve()
    let resolveFn: CallableFunction | undefined
    const promise = new Promise((resolve) => {
      resolveFn = resolve
    })

    this.promises.push({
      resolve: resolveFn!,
      promise
    })

    return await next
  }

  shift(): void {
    const deferred = this.promises.shift()
    if (typeof deferred !== 'undefined') deferred.resolve()
  }
}
