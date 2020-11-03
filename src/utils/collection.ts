export class Collection<K = string, V = any> extends Map<K, V> {
  set(key: K, value: V): this {
    return super.set(key, value)
  }

  array(): V[] {
    return [...this.values()]
  }

  first(): V {
    return this.values().next().value
  }

  last(): V {
    return [...this.values()][this.size - 1]
  }

  random(): V {
    const arr = [...this.values()]
    return arr[Math.floor(Math.random() * arr.length)]
  }

  find(callback: (value: V, key: K) => boolean): V | undefined {
    for (const key of this.keys()) {
      const value = this.get(key) as V
      // eslint-disable-next-line standard/no-callback-literal
      if (callback(value, key)) return value
    }
  }

  filter(callback: (value: V, key: K) => boolean): Collection<K, V> {
    const relevant = new Collection<K, V>()
    this.forEach((value, key) => {
      if (callback(value, key)) relevant.set(key, value)
    })
    return relevant
  }

  map<T>(callback: (value: V, key: K) => T): T[] {
    const results = []
    for (const key of this.keys()) {
      const value = this.get(key) as V
      results.push(callback(value, key))
    }
    return results
  }

  some(callback: (value: V, key: K) => boolean): boolean {
    for (const key of this.keys()) {
      const value = this.get(key) as V
      if (callback(value, key)) return true
    }
    return false
  }

  every(callback: (value: V, key: K) => boolean): boolean {
    for (const key of this.keys()) {
      const value = this.get(key) as V
      if (!callback(value, key)) return false
    }
    return true
  }

  reduce<T>(
    callback: (accumulator: T, value: V, key: K) => T,
    initialValue?: T,
  ): T {
    let accumulator: T = initialValue as T

    for (const key of this.keys()) {
      const value = this.get(key) as V
      accumulator = callback(accumulator, value, key)
    }

    return accumulator
  }

  static fromObject<V>(object: { [key: string]: V }): Collection<string, V> {
    return new Collection<string, V>(Object.entries(object))
  }

  toObject(): { [name: string]: V } {
    return Object.fromEntries(this)
  }
}