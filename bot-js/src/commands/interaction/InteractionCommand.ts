import { Interaction } from "discord.js";

export interface InteractionCommand {
    execute(interaction: Interaction): Promise<void>;
}
