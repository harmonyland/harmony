interface Invite {
    code: string
    guild?: any //guild object
    channel: any //channel object
    inviter?: User
    target_user?: User
    target_user_type?: number
    approximate_presence_count?: number
    approximate_member_count?: number
}