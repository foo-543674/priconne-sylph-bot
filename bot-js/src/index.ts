import yaml from "js-yaml";
import fs from "fs";
import cron from "node-cron";
import { YamlPhraseRepository } from "./yaml/YamlPhraseRepository";
import { PhraseConfig } from "./support/PhraseConfig";
import { Client, Intents } from "discord.js";
import { ApiClient } from "./backend/ApiClient";
import * as batch from "./batch";
import { DateFnsLocalDateProvider } from "./date-fns/DateFnsLocalDateProvider";
import { MessageEventHandler } from "./MessageEventHandler";
import { ReactionEventHandler } from "./ReactionEventHandler";
import { InteractionEventHandler } from "./InteractionEventHandler";
import { DamageInputCommand } from "./commands/interaction/DamageInputCommand";
import { ReportTaskKillCommand } from "./commands/reaction/ReportTaskKillCommand";
import { ReportCarryOverCommand } from "./commands/reaction/ReportCarryOverCommand";
import { ReportChallengeCommand } from "./commands/reaction/ReportChallengeCommand";
import { BossSubjugationCommand } from "./commands/message/BossSubjugationCommand";
import { RegisterUncompleteMemberRoleCommand } from "./commands/message/RegisterUncompleteMemberRoleCommand";
import { RegisterCooperateChannelCommand } from "./commands/message/RegisterCooperateChannelCommand";
import { AddCommentToDamageReportCommand } from "./commands/message/AddCommentToDamageReportCommand";
import { PrepareDamageReportCommand } from "./commands/message/PrepareDamageReportCommand";
import { GetBossQuestionnaireResultCommand } from "./commands/message/GetBossQuestionnaireResultCommand";
import { BossNotificationCommand } from "./commands/message/BossNotificationCommand";
import { CreateBossQuestionnaireCommand } from "./commands/message/CreateBossQuestionnaireCommand";
import { CreateChallengeReportCommand } from "./commands/message/CreateChallengeReportCommand";
import { RegisterWebhookCommand } from "./commands/message/RegisterWebhookCommand";
import { RegisterMembersCommand } from "./commands/message/RegisterMembersCommand";
import { RegisterClanCommand } from "./commands/message/RegisterClanCommand";
import { HelpCommand } from "./commands/message/HelpCommand";
import { BossSelectButtonCommand } from "./commands/interaction/BossSelectButtonCommand";
import { ChallengerSelectMenuCommand } from "./commands/interaction/ChallengerSelectMenuCommand";
import { StartChallengeCommand } from "./commands/interaction/StartChallengeCommand";
import { DeleteDamageReportCommand } from "./commands/interaction/DeleteDamageReportCommand";
import { RequestRescueCommand } from "./commands/interaction/RequestRescueCommand";
import { QuestionaireReactionCommand } from "./commands/reaction/QuestionaireReactionCommand";

const phraseConfig = yaml.load(fs.readFileSync("src/resources/config.yaml", "utf8"));
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
        Intents.FLAGS.GUILD_PRESENCES
    ],
    partials: ["REACTION", "CHANNEL", "GUILD_MEMBER", "MESSAGE", "USER"],
    restTimeOffset: 300,
    retryLimit: 3,
    restGlobalRateLimit: 3
});

if (!(process.env.API_URI && process.env.API_KEY && process.env.DISCORD_TOKEN)) {
    throw Error("Environment variable DISCORD_TOKEN, API_URI, API_KEY required.");
}

const apiClient = new ApiClient(process.env.API_URI, process.env.API_KEY);
const localDateTimeProvider = new DateFnsLocalDateProvider(process.env.TZ ?? "Asia/Tokyo");

const messaegEventHandler = new MessageEventHandler(
    [
        new HelpCommand(phraseRepository, client),
        new RegisterClanCommand(phraseRepository, client, apiClient),
        new RegisterMembersCommand(phraseRepository, apiClient, client),
        new RegisterWebhookCommand(phraseRepository, client, apiClient),
        new CreateChallengeReportCommand(phraseRepository, client, apiClient),
        new CreateBossQuestionnaireCommand(phraseRepository, client, apiClient),
        new BossNotificationCommand(phraseRepository, client),
        new GetBossQuestionnaireResultCommand(phraseRepository, client),
        new PrepareDamageReportCommand(phraseRepository, client, apiClient),
        new AddCommentToDamageReportCommand(apiClient, phraseRepository, client),
        new RegisterCooperateChannelCommand(phraseRepository, client, apiClient),
        new RegisterUncompleteMemberRoleCommand(phraseRepository, client, apiClient),
        new BossSubjugationCommand(phraseRepository, client, apiClient)
    ],
    phraseRepository
);
messaegEventHandler.listen(client);

const reactionEventHandler = new ReactionEventHandler([
    new ReportChallengeCommand(phraseRepository, apiClient, localDateTimeProvider),
    new ReportCarryOverCommand(phraseRepository, apiClient),
    new ReportTaskKillCommand(phraseRepository, apiClient),
    new QuestionaireReactionCommand(phraseRepository, client)
]);
reactionEventHandler.listen(client);

const interactionEventHandler = new InteractionEventHandler([
    new BossSelectButtonCommand(apiClient, phraseRepository),
    new ChallengerSelectMenuCommand(apiClient, phraseRepository),
    new StartChallengeCommand(apiClient, phraseRepository),
    new DamageInputCommand(phraseRepository, apiClient),
    new DeleteDamageReportCommand(apiClient, phraseRepository),
    new RequestRescueCommand(apiClient, phraseRepository)
]);
interactionEventHandler.listen(client);

cron.schedule(
    "0 5 * * *",
    () => {
        const command = new batch.AddUncompleteMemberRoleBatch(apiClient, client);
        command.execute().catch(console.log);
    },
    {
        timezone: "Asia/Tokyo"
    }
);

client.on("ready", (c) => console.log(`${c.user.username} logged in`));
client.login(process.env.DISCORD_TOKEN).catch((error) => console.log(error));
