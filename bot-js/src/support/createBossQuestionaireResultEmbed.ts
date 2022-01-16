import { pipe } from "fp-ts/lib/function";
import * as TaskOption from "fp-ts/lib/TaskOption";
import { Message, TextChannel } from "discord.js";

export async function createBossQuestionnaireResultEmbed(
    targetEmojis: readonly string[],
    message: Message,
    excludeUserIds: readonly string[],
    channel: TextChannel
) {
    return await Promise.all(
        targetEmojis.map(
            async (targetEmoji) =>
                await pipe(
                    TaskOption.fromNullable(message.reactions.resolve(targetEmoji)),
                    TaskOption.chainTaskK((targetReaction) => async () => await targetReaction.users.fetch()),
                    TaskOption.map((users) =>
                        users.filter((user) => !excludeUserIds.includes(user.id)).map((user) => user.id)
                    ),
                    TaskOption.chainTaskK(
                        (userIds) => async () => await channel.guild.members.fetch({ user: userIds })
                    ),
                    TaskOption.map((guildMembers) =>
                        guildMembers.map((member) => member.nickname ?? member.user.username)
                    ),
                    TaskOption.map((names) => names.join("\n")),
                    TaskOption.fold(
                        () => () =>
                            Promise.resolve({
                                name: `${targetEmoji}ボス`,
                                value: "希望者なし",
                                inline: true
                            }),
                        (membersListText) => () =>
                            Promise.resolve({
                                name: `${targetEmoji}ボス`,
                                value: membersListText ? membersListText : "希望者なし",
                                inline: true
                            })
                    )
                )()
        )
    );
}
