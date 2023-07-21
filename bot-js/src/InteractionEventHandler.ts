import { Client, Events, Interaction } from "discord.js";
import { InteractionCommand } from "./commands/interaction/InteractionCommand";

export class InteractionEventHandler {
    constructor(private readonly commands: InteractionCommand[]) {}

    public listen(client: Client) {
        client.on(Events.InteractionCreate, async (interaction) => await this.onInteractionCreate(interaction, client));
    }

    protected async onInteractionCreate(interaction: Interaction, _: Client) {
        console.log("interaction received");

        try {
            await Promise.all(
                this.commands.map(async (command) => {
                    await command.execute(interaction);
                })
            );
        } catch (error) {
            console.log(error);
        }
    }
}
