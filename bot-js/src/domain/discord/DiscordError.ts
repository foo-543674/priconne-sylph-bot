export class DiscordError extends Error {
    constructor(message: string, options?: ErrorOptions) {
        super(message, options)
    }
}
