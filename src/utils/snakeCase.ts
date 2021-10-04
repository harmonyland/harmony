export function camelCase(name: string): string {
  const parts = name.split('_')
  return parts
    .map((e, i) =>
      i === 0 ? e : e === 'id' ? 'ID' : `${e[0].toUpperCase()}${e.slice(1)}`
    )
    .join('')
}

// Can't really make an actual type for this
export function toCamelCase(data: any): any {
  if (Array.isArray(data))
    return data.map((e) => {
      return typeof e === 'object' && e !== null ? toCamelCase(e) : e
    })
  const result: any = {}
  Object.entries(data).forEach(([k, v]) => {
    result[camelCase(k)] =
      typeof v === 'object' && v !== null ? toCamelCase(v) : v
  })
  return result
}
