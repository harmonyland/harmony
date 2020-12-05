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

  /** Get first value in Collection */
  first(): V {
    return this.values().next().value
  }

  /** Get last value in Collection */
  last(): V {
    return [...this.values()][this.size - 1]
  }

  /** Get a random value from Collection */
  random(): V {
    const arr = [...this.values()]
    return arr[Math.floor(Math.random() * arr.length)]
  }

  /** Find a value from Collection using callback */
  find(callback: (value: V, key: K) => boolean): V | undefined {
    for (const key of this.keys()) {
      const value = this.get(key) as V
      // eslint-disable-next-line standard/no-callback-literal
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
