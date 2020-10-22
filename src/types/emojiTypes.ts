interface Emoji {
    id: string
    name: string | undefined
    roles?: []
    user?: User
    require_colons?: boolean
    managed?: boolean
    animated?: boolean
    available?: boolean
}