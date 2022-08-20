// Note: can't change this any to unknown now, it'd be breaking

/** Enhanced Map with various utility functions */
export class Collection<K = string, V = any> extends Map<K, V> {
  /** Set a key to value in Collection */
  set(key: K, value: V): this {
    return super.set(key, value)
  }

  /** Get Array of values in Collection */
  array(): V[] {
    return [...this.values()]
  }

  /** Get first value(s) in Collection */
  first(): V | undefined
  first(amount: number): V[]
  first(amount?: number): V | V[] | undefined {
    if (typeof amount === 'undefined') return this.values().next().value
    if (amount < 0) return this.last(amount * -1)
    amount = Math.min(this.size, amount)
    const iter = this.values()
    return Array.from({ length: amount }, (): V => iter.next().value)
  }

  /** Get last value(s) in Collection */
  last(): V | undefined
  last(amount: number): V[]
  last(amount?: number): V | V[] | undefined {
    const arr = this.array()
    if (typeof amount === 'undefined') return arr[arr.length - 1]
    if (amount < 0) return this.first(amount * -1)
    if (!amount) return [] // eslint-disable-line
    return arr.slice(-amount)
  }

  /** Get random value(s) from Collection */
  random(): V
  random(amount: number): V[]
  random(amount?: number): V | V[] {
    let arr = this.array()
    if (typeof amount === 'undefined')
      return arr[Math.floor(Math.random() * arr.length)]
    if (arr.length === 0 || !amount) return [] // eslint-disable-line
    arr = arr.slice()
    return Array.from(
      { length: amount },
      (): V => arr.splice(Math.floor(Math.random() * arr.length), 1)[0]
    )
  }

  /** Find a value from Collection using callback */
  find(callback: (value: V, key: K) => boolean): V | undefined {
    for (const key of this.keys()) {
      const value = this.get(key) as V
      if (callback(value, key)) return value
    }
  }

  /** Filter out the Collection using callback */
  filter(callback: (value: V, key: K) => boolean): Collection<K, V> {
    const relevant = new Collection<K, V>()
    this.forEach((value, key) => {
      if (callback(value, key)) relevant.set(key, value)
    })
    return relevant
  }

  /** Map the collection */
  map<T>(callback: (value: V, key: K) => T): T[] {
    const results = []
    for (const key of this.keys()) {
      const value = this.get(key) as V
      results.push(callback(value, key))
    }
    return results
  }

  /** Check if any of the values/keys in Collection satisfies callback */
  some(callback: (value: V, key: K) => boolean): boolean {
    for (const key of this.keys()) {
      const value = this.get(key) as V
      if (callback(value, key)) return true
    }
    return false
  }

  /** Check if every value/key in Collection satisfies callback */
  every(callback: (value: V, key: K) => boolean): boolean {
    for (const key of this.keys()) {
      const value = this.get(key) as V
      if (!callback(value, key)) return false
    }
    return true
  }

  /** Reduce the Collection to a single value */
  reduce<T>(
    callback: (accumulator: T, value: V, key: K) => T,
    initialValue?: T
  ): T {
    let accumulator: T = initialValue as T

    for (const key of this.keys()) {
      const value = this.get(key) as V
      accumulator = callback(accumulator, value, key)
    }

    return accumulator
  }

  /** Create a Collection from an Object */
  static fromObject<V>(object: { [key: string]: V }): Collection<string, V> {
    return new Collection<string, V>(Object.entries(object))
  }

  /** Convert Collection to an object */
  toObject(): { [name: string]: V } {
    return Object.fromEntries(this)
  }
}
