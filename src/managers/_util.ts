import {
  MessageComponentData,
  MessageComponentPayload
} from '../types/messageComponents.ts'

export function transformComponent(
  d: MessageComponentData[]
): MessageComponentPayload[] {
  return d.map((e: any) => {
    e = { ...e }
    if (e.customID !== undefined) {
      e.custom_id = e.customID
      delete e.customID
    }
    if (e.minValues !== undefined) {
      e.min_values = e.minValues
      delete e.minValues
    }
    if (e.maxValues !== undefined) {
      e.max_values = e.maxValues
      delete e.maxValues
    }
    if (e.components !== undefined) {
      e.components = transformComponent(e.components)
    }
    return e
  })
}

export function transformComponentPayload(
  d: MessageComponentPayload[]
): MessageComponentData[] {
  return d.map((e: any) => {
    e = { ...e }
    if (e.custom_id !== undefined) {
      e.customID = e.custom_id
      delete e.custom_id
    }
    if (e.min_values !== undefined) {
      e.minValues = e.min_values
      delete e.min_values
    }
    if (e.max_values !== undefined) {
      e.maxValues = e.max_values
      delete e.max_values
    }
    if (e.components !== undefined) {
      e.components = transformComponent(e.components)
    }
    return e
  })
}
