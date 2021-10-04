import {
  ButtonStyle,
  MessageComponentData,
  MessageComponentPayload,
  MessageComponentType
} from '../types/messageComponents.ts'
import { toCamelCase } from '../utils/snakeCase.ts'

export function transformComponent(
  d: MessageComponentData[]
): MessageComponentPayload[] {
  return d.map((data: unknown) => {
    const e = { ...(data as Record<string, unknown>) }
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
      e.components = transformComponent(e.components as MessageComponentData[])
    }
    if (typeof e.type === 'string') {
      e.type =
        MessageComponentType[
          e.type.toUpperCase() as keyof typeof MessageComponentType
        ]
    }
    if (typeof e.style === 'string') {
      e.style = ButtonStyle[e.style.toUpperCase() as keyof typeof ButtonStyle]
    }
    return e
  }) as unknown as MessageComponentPayload[]
}

export function transformComponentPayload(
  d: MessageComponentPayload[]
): MessageComponentData[] {
  return d.map(toCamelCase)
}
