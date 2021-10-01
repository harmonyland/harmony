export interface SimplifiedError {
  [name: string]: string[]
}

// It's a deeply nested object just let it be like this
export function simplifyAPIError(errors: any): SimplifiedError {
  const res: SimplifiedError = {}
  function fmt(obj: any, acum: string = ''): void {
    if (typeof obj._errors === 'object' && Array.isArray(obj._errors))
      res[acum] = obj._errors.map((e: any) => `${e.code}: ${e.message}`)
    else {
      Object.entries(obj).forEach((obj: [string, any]) => {
        const arrayIndex = !isNaN(Number(obj[0]))
        if (arrayIndex) obj[0] = `[${obj[0]}]`
        fmt(obj[1], acum + (acum !== '' && !arrayIndex ? '.' : '') + obj[0])
      })
    }
  }
  Object.entries(errors).forEach((obj: [string, any]) => {
    if (obj[0] === '_errors') {
      fmt({ _errors: obj[1] }, 'Request')
    } else fmt(obj[1], obj[0])
  })
  return res
}
