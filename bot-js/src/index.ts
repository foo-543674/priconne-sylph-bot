import yaml from "js-yaml";
import fs from "fs";
import cron from "node-cron";
import { YamlPhraseRepository } from "./yaml/YamlPhraseRepository";
import { PhraseConfig } from "./support/PhraseConfig";
import { Client, Intents } from "discord.js";
import { ApiClient } from "./backend/ApiClient";
import * as batch from "./batch";
import { MessageEventHandler } from "./MessageEventHandler";
import { ReactionEventHandler } from "./ReactionEventHandler";
import { InteractionEventHandler } from "./InteractionEventHandler";
import { NumberInputCommand } from "./commands/interaction/NumberInputCommand";
import { ReportTaskKillCommand } from "./commands/reaction/ReportTaskKillCommand";
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
import { MemberSelectMenuCommand } from "./commands/interaction/MemberSelectMenuCommand";
import { StartChallengeCommand } from "./commands/interaction/StartChallengeCommand";
import { DeleteDamageReportCommand } from "./commands/interaction/DeleteDamageReportCommand";
import { RequestRescueCommand } from "./commands/interaction/RequestRescueCommand";
import { QuestionaireReactionCommand } from "./commands/reaction/QuestionaireReactionCommand";
import { ThreadSafeCache } from "./support/ThreadSafeCache";
import { BossQuestionnaire } from "./entities/BossQuestionnaire";
import { OpenDamageInputFormCommand } from "./commands/interaction/OpenDamageInputFormCommand";
import { ChallengedTypeSelectCommand } from "./commands/interaction/ChallengedTypeSelectCommand";
import { OpenCreateCarryOverFormCommand } from "./commands/interaction/OpenCreateCarryOverFormCommand";
import { DeleteCarryOverCommand } from "./commands/interaction/DeleteCarryOverCommand";
import { AddCommentToCarryOverCommand } from "./commands/message/AddCommentToCarryOverCommand";
import { RetryChallengeCommand } from "./commands/interaction/RetryChallengeCommand";
import { RequestPinCommand } from "./commands/message/RequestPinCommand";
import { RequestUnpinCommand } from "./commands/message/RequestUnpinCommand";
import { DiceCommand } from "./commands/message/DiceCommand";
import { BCDice } from "./support/Dice";

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
// const localDateTimeProvider = new DateFnsLocalDateProvider(process.env.TZ ?? "Asia/Tokyo");

const bossQuestionnaireCache = new ThreadSafeCache<BossQuestionnaire>();

const messaegEventHandler = new MessageEventHandler(
    [
        new HelpCommand(phraseRepository, client),
        new RegisterClanCommand(phraseRepository, client, apiClient),
        new RegisterMembersCommand(phraseRepository, apiClient, client),
        new RegisterWebhookCommand(phraseRepository, client, apiClient),
        new CreateChallengeReportCommand(phraseRepository, client, apiClient),
        new CreateBossQuestionnaireCommand(phraseRepository, client, apiClient, bossQuestionnaireCache),
        new BossNotificationCommand(phraseRepository, client),
        new GetBossQuestionnaireResultCommand(phraseRepository, client),
        new PrepareDamageReportCommand(phraseRepository, client, apiClient),
        new AddCommentToDamageReportCommand(apiClient, phraseRepository, client),
        new RegisterCooperateChannelCommand(phraseRepository, client, apiClient),
        new RegisterUncompleteMemberRoleCommand(phraseRepository, client, apiClient),
        new BossSubjugationCommand(phraseRepository, client, apiClient),
        new AddCommentToCarryOverCommand(apiClient, phraseRepository, client),
        new RequestPinCommand(phraseRepository, client),
        new RequestUnpinCommand(phraseRepository, client),
        new DiceCommand(client, new BCDice())
    ],
    phraseRepository
);
messaegEventHandler.listen(client);

const reactionEventHandler = new ReactionEventHandler([
    new ReportChallengeCommand(phraseRepository, apiClient),
    new ReportTaskKillCommand(phraseRepository, apiClient),
    new QuestionaireReactionCommand(phraseRepository, client, bossQuestionnaireCache)
]);
reactionEventHandler.listen(client);

const numberInputCommand = new NumberInputCommand(phraseRepository);
const challengedTypeSelectCommand = new ChallengedTypeSelectCommand(phraseRepository);
const interactionEventHandler = new InteractionEventHandler([
    new BossSelectButtonCommand(apiClient, phraseRepository),
    new MemberSelectMenuCommand(apiClient, phraseRepository),
    new StartChallengeCommand(apiClient, phraseRepository),
    numberInputCommand,
    challengedTypeSelectCommand,
    new OpenDamageInputFormCommand(phraseRepository, apiClient, numberInputCommand),
    new OpenCreateCarryOverFormCommand(phraseRepository, apiClient, numberInputCommand, challengedTypeSelectCommand),
    new DeleteDamageReportCommand(apiClient, phraseRepository),
    new RequestRescueCommand(apiClient, phraseRepository),
    new DeleteCarryOverCommand(apiClient, phraseRepository),
    new RetryChallengeCommand(apiClient, phraseRepository)
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
