import { Command, Member, CommandContext, Embed } from '../../../mod.ts'

export default class UserinfoCommand extends Command {
    name = "userinfo"
    guildOnly = true
    aliases = [ 'u', 'user' ]

    async execute(ctx: CommandContext): Promise<void> {
        const member: Member = ctx.message.member as any
        const roles = await member.roles.array()
        const embed = new Embed()
        .setTitle(`User Info`)
        .setAuthor({ name: member.user.tag })
        .addField("ID", member.id)
        .addField("Roles", roles.map(r => r.name).join(", "))
        .setColor(0xff00ff)
        ctx.channel.send(embed)
    }
}