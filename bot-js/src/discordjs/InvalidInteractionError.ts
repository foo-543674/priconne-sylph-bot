import { BaseInteraction } from "discord.js";
/**
 * BOTの仕様上ありえない操作を受け付けた時に投げられる例外
 */
export class InvalidInteractionError extends Error {
    constructor(message: string, interaction: BaseInteraction) {
        super(`${message}\n\r${interaction.toJSON()}`);
    }
}
