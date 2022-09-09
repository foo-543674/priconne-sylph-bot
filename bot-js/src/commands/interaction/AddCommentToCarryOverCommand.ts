// import { Message, Client } from "discord.js";
// import { MessageCommand } from "./MessageCommand";
// import { PhraseRepository } from "../../support/PhraseRepository";
// import { ApiClient } from "../../backend/ApiClient";
// import { removeMentionsFromContent } from "../../discordjs/DiscordHelper";

// export class AddCommentToCarryOverCommand implements MessageCommand {
//     constructor(
//         private apiClient: ApiClient,
//         private phraseRepository: PhraseRepository,
//         private discordClient: Client
//     ) {}

//     async execute(message: Message): Promise<void> {
//         if (message.author.id === this.discordClient.user?.id) return;
//         if (!message.reference) return;
//         const channel = message.channel;

//         const carryOvers = await this.apiClient.getCarryOvers(channel.id, {
//             messageid: message.reference.messageId
//         });
//         if (carryOvers.length <= 0) return;
//         console.log("start add comment to carry over command");

//         const target = carryOvers[0];

//         const updatedCarryOver = await this.apiClient.postCarryOver(
//             target.setComment(removeMentionsFromContent(message))
//         );
//         const reportMessage = await channel.messages.fetch(target.messageId);
//         await reportMessage.edit(updatedCarryOver.generateMessage(this.phraseRepository));

//         // NOTE: メッセージ作成後に即削除するとクライアント側でメッセージが消えなくなる現象があるのでディレイを設ける
//         setTimeout(async () => {
//             await message.delete();
//         }, 1000);
//     }
// }
