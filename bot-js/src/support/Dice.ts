import { DynamicLoader } from "bcdice";
import GameSystemClass from "bcdice/lib/game_system";
import { convertFullWidth } from "./MessageParser";

export type DiceCommand = string;
export type DiceSystemName = "DiceBot";
export const FailedResult = "none";

export interface Dice {
    loadSystem(systemName: DiceSystemName): Promise<void>;
    roll(command: DiceCommand): string;
    isEnableCommand(text: string): text is DiceCommand;
}

export class DiceNotSetupError extends Error {
    constructor(message = "Dice is not setup.") {
        super(`${message}`);
    }
}

export class BCDice implements Dice {
    private gameSystem: GameSystemClass | null = null;

    public async loadSystem(systemName: DiceSystemName): Promise<void> {
        const loader = new DynamicLoader();
        this.gameSystem = await loader.dynamicLoad(systemName);
    }

    public roll(command: string): string {
        if (!this.gameSystem) throw new DiceNotSetupError();
        return this.gameSystem.eval(command)?.text ?? FailedResult;
    }

    public isEnableCommand(text: string): text is DiceCommand {
        if (!this.gameSystem) throw new DiceNotSetupError();
        return this.gameSystem.COMMAND_PATTERN.test(convertFullWidth(text).trim());
    }
}
