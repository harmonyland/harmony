import {
  MessageComponentEmoji,
  MessageComponentPayload
} from '../types/messageComponents.ts'

export type ElementType = 'Root' | 'ActionRow' | 'Button' | 'Select' | 'Option'
export type ButtonStyleName =
  | 'primary'
  | 'secondary'
  | 'success'
  | 'danger'
  | 'link'
  | 'blurple'
  | 'grey'
  | 'red'
  | 'green'

// Note: Believe me `any`s in here are for good.

export interface Element<T = any> {
  type: ElementType
  props: T
  children?: Element[]
}

export type Component<T = any> = (props?: T, children?: any) => Element<T>

/** Represents a row containing other components. All components must go inside Action Rows. */
export function ActionRow(props: {}, children: Element[]): Element<{}> {
  return {
    type: 'ActionRow',
    props,
    children
  }
}

export interface ButtonProps {
  id?: string
  label?: string
  style: ButtonStyleName
  url?: string
  disabled?: boolean
  emoji?: MessageComponentEmoji
}

/** A button component */
export function Button(
  props: ButtonProps,
  _children: undefined
): Element<ButtonProps> {
  return {
    type: 'Button',
    props,
    children: undefined
  }
}

export interface SelectProps {
  id: string
  placeholder?: string
  minValues?: number
  maxValues?: number
  disabled?: boolean
}

/** Select (drop down) component. Allows user to choose one or more options */
export function Select(
  props: SelectProps,
  children: Array<Array<Element<OptionProps>>>
): Element<SelectProps> {
  return {
    type: 'Select',
    props,
    children: children[0] // FIXME: Why is it double nested?
  }
}

export interface OptionProps {
  label: string
  value: string
  description?: string
  emoji?: MessageComponentEmoji
  default?: boolean
}

/** An option or choice for Select Component */
export function Option(
  props: OptionProps,
  _children: undefined
): Element<OptionProps> {
  return {
    type: 'Option',
    props,
    children: undefined
  }
}

/** TSX compiles down to BotUI.createElement */
// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export class BotUI {
  static createElement<T = any>(
    component: Component<T>,
    props: T,
    ...children: Array<Element<ButtonProps | SelectProps>>
  ): Element<T> {
    if (component === undefined) return undefined as any
    const element = component(props, children)
    return element
  }
}

function resolveStyle(name: ButtonStyleName): number {
  switch (name) {
    case 'primary':
    case 'blurple':
      return 1
    case 'secondary':
    case 'grey':
      return 2
    case 'success':
    case 'green':
      return 3
    case 'danger':
    case 'red':
      return 4
    case 'link':
      return 5
    default:
      throw new Error(`Invalid style: ${name}`)
  }
}

/** Fragment is like the root component which converts TSX elements into Component Payload */
export function fragment(
  props: null,
  components: Element[]
): MessageComponentPayload[] {
  if (props !== null) throw new Error('Root fragment does not accept props')
  const res: MessageComponentPayload[] = []

  components.flat(2).forEach((component) => {
    if (typeof component !== 'object' || component === null) return
    if (component.type !== 'ActionRow') {
      throw new Error('Only ActionRow components may appear at top level')
    }
    const row: MessageComponentPayload = {
      type: 1,
      components: []
    }

    component.children
      ?.flat(2)
      .forEach((el: Element<ButtonProps | SelectProps>) => {
        if (el.type === 'Button') {
          const props = el.props as ButtonProps
          row.components?.push({
            type: 2,
            custom_id: props.id,
            label: props.label,
            style: resolveStyle(props.style),
            url: props.url,
            emoji: props.emoji,
            disabled: props.disabled
          })
        } else if (el.type === 'Select') {
          const props = el.props as SelectProps
          row.components?.push({
            type: 3,
            custom_id: props.id,
            min_values: props.minValues,
            max_values: props.maxValues,
            placeholder: props.placeholder,
            disabled: props.disabled,
            options: Array.isArray(el.children)
              ? el.children.map((e) => {
                  return e.props
                })
              : []
          })
        } else {
          throw new Error('Invalid second level component: ' + el.type)
        }
      })

    if (row.components !== undefined && row.components.length > 5) {
      throw new Error('An Action Row may only have 5 components at max')
    }

    res.push(row)
  })

  if (res.length > 5) {
    throw new Error(`Max number of components exceeded ${res.length}`)
  }

  return res
}
