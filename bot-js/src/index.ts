import yaml from "js-yaml";
import fs from "fs";
import { YamlPhraseRepository } from "./yaml/YamlPhraseRepository";
import { PhraseConfig } from "./support/PhraseConfig";
import { Client, Intents } from "discord.js";
import { Sylph } from './Sylph';
import { ApiClient } from './backend/ApiClient';
import * as commands from "./commands";

const phraseConfig = yaml.load(fs.readFileSync('src/resources/config.yaml', 'utf8'));
const phraseRepository = new YamlPhraseRepository(phraseConfig as PhraseConfig);

const client = new Client({
    intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MEMBERS,
        Intents.FLAGS.GUILD_MESSAGES,
        Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
        Intents.FLAGS.GUILD_MESSAGE_TYPING,
        Intents.FLAGS.GUILD_EMOJIS_AND_STICKERS,
        Intents.FLAGS.GUILD_INTEGRATIONS,
        Intents.FLAGS.GUILD_PRESENCES,
    ],
    partials: ["REACTION", "CHANNEL", "GUILD_MEMBER", "MESSAGE", "USER"],
});

client.on("rateLimit", console.log);

if (!(process.env.API_URI && process.env.API_KEY && process.env.DISCORD_TOKEN)) {
    throw Error("Environment variable DISCORD_TOKEN, API_URI, API_KEY required.");
}

const apiClient = new ApiClient(process.env.API_URI, process.env.API_KEY);

const bot = new Sylph(client, phraseRepository);
bot.addMessageCommand(new commands.HelpCommand(phraseRepository, client));
bot.addMessageCommand(new commands.RegisterClanCommand(phraseRepository, client, apiClient));
bot.addMessageCommand(new commands.RegisterMembersCommand(phraseRepository, apiClient, client));
bot.addMessageCommand(new commands.RegisterWebhookCommand(phraseRepository, client, apiClient));
bot.addMessageCommand(new commands.CreateChallengeReportCommand(phraseRepository, client, apiClient));
bot.addMessageCommand(new commands.CreateBossQuestionnaireCommand(phraseRepository, client));
bot.addMessageCommand(new commands.BossNotificationCommand(phraseRepository, client));
bot.addMessageCommand(new commands.GetBossQuestionnaireResultCommand(phraseRepository, client));
bot.addMessageCommand(new commands.PrepareDamageReportCommand(phraseRepository, client, apiClient));
bot.addMessageCommand(new commands.DamageReportCommand(phraseRepository, client, apiClient));
bot.addMessageCommand(new commands.RegisterCooperateChannelCommand(phraseRepository, client, apiClient));
bot.addMessageCommand(new commands.CleanDamageReportCommand(phraseRepository, client, apiClient));
bot.addMessageCommand(new commands.RegisterUncompleteMemberRoleCommand(phraseRepository, client, apiClient));

bot.addReactionCommand(new commands.ReportChallengeCommand(phraseRepository, apiClient));
bot.addReactionCommand(new commands.ReportCarryOverCommand(phraseRepository, apiClient));
bot.addReactionCommand(new commands.ReportTaskKillCommand(phraseRepository, apiClient));

bot.login(process.env.DISCORD_TOKEN).catch(error => console.log(error));
