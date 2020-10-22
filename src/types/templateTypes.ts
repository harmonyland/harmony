interface Template {
    code: string
    name: string
    description: string | undefined
    usage_count: number
    creator_id: string
    creator: User
    created_at: string
    updated_at: string
    source_guild_id: string
    serialized_source_guild: any //guild object
    is_dirty: boolean | undefined
}