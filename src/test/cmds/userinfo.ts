import { Command, Member, CommandContext, Embed } from '../../../mod.ts'

export default class UserinfoCommand extends Command {
    name = "userinfo"
    guildOnly = true

    execute(ctx: CommandContext): void {
        const member: Member = ctx.message.member as any
        const embed = new Embed()
        .setTitle(`User Info`)
        .setAuthor({ name: member.user.tag })
        .addField("ID", member.id)
        .addField("Roles", member.roles.map(r => r.name).join(", "))
        ctx.channel.send(embed)
    }
}