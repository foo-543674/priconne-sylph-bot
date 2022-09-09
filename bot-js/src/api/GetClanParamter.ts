
export class GetClanParamter {
    constructor(
        private name?: string,
        private discordUserId?: string,
        private reportChannelId?: string
    ) { }

    public generateQueryParameterText() {
        return [
            this.name ? `name=${this.name}` : '',
            this.discordUserId ? `discord_user_id=${this.discordUserId}` : '',
            this.reportChannelId ? `report_channel_id=${this.reportChannelId}` : '',
        ].filter(Boolean).join('&');
    }
}
