interface Invite {
    code: string
    guild?: Guild
    channel: Channel
    inviter?: User
    target_user?: User
    target_user_type?: number
    approximate_presence_count?: number
    approximate_member_count?: number
}