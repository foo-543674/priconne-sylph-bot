import yaml from "js-yaml";
import fs from "fs";
import cron from "node-cron";
import { YamlPhraseRepository } from "./yaml/YamlPhraseRepository";
import { PhraseConfig } from "./support/PhraseConfig";
import { Client, GatewayIntentBits, Partials } from 'discord.js';
import { ApiClient } from "./backend/ApiClient";
import * as batch from "./batch";
import { MessageEventHandler } from "./MessageEventHandler";
import { ReactionEventHandler } from "./ReactionEventHandler";
import { InteractionEventHandler } from "./InteractionEventHandler";
import { ReportTaskKillCommand } from "./commands/reaction/ReportTaskKillCommand";
import { ReportChallengeCommand } from "./commands/reaction/ReportChallengeCommand";
import { BossSubjugationCommand } from "./commands/message/BossSubjugationCommand";
import { RegisterUncompleteMemberRoleCommand } from "./commands/message/RegisterUncompleteMemberRoleCommand";
import { RegisterCooperateChannelCommand } from "./commands/message/RegisterCooperateChannelCommand";
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
import { RetryChallengeCommand } from "./commands/interaction/RetryChallengeCommand";
import { RequestPinCommand } from "./commands/message/RequestPinCommand";
import { RequestUnpinCommand } from "./commands/message/RequestUnpinCommand";
import { DiceCommand } from "./commands/message/DiceCommand";
import { BCDice } from "./support/Dice";
import { CalculateCarryOverTlCommand } from "./commands/message/CalculateCarryOverTlCommand";
import { OpenEditCarryOverCommand } from "./commands/interaction/OpenEditCarryOverCommand";
import { SubmitReportDamageCommand } from "./commands/interaction/SubmitReportDamageCommand";
import { SubmitRegisterCarryOverCommand } from "./commands/interaction/SubmitRegisterCarryOverCommand";
import { SubmitEditCarryOverCommand } from "./commands/interaction/SubmitEditCarryOverCommand";
import { SubmitCreateTimelineThreadCommand } from "./commands/interaction/SubmitCreateTimelineThreadCommand";
import { CreateTimelineThreadUsecase } from "./domain/timeline-thread/CreateTimelineThreadUsecase";
import { OpenCreateTimelineThreadFormCommand } from "./commands/interaction/OpenCreateTimelineThreadFormCommand";
import { SetupTimelineChannelCommand } from "./commands/message/SetupTimelineChannelCommand";
import { SetupTimelineThreadChannelUsecase } from "./domain/timeline-thread/SetupTimelineThreadChannelUsecase";
import { OmikujiCommand } from "./commands/message/OmikujiCommand";
import { LotteryBox } from "./domain/omikuji/LotteryBox";
import { SeedRandomProvider } from "./libraries/random/SeedRandomProvider";
import { CDateLocalDateProvider } from "./libraries/cdate/CDateLocalDateProvider";
import { RandomSortedFortuneTable } from "./domain/omikuji/FortuneTable";

const phraseConfig = yaml.load(fs.readFileSync("src/resources/config.yaml", "utf8"));
const phraseRepository = new YamlPhraseRepository(phraseConfig as PhraseConfig);

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildMessageReactions,
        GatewayIntentBits.GuildMessageTyping,
        GatewayIntentBits.GuildEmojisAndStickers,
        GatewayIntentBits.GuildIntegrations,
        GatewayIntentBits.GuildPresences,
        GatewayIntentBits.MessageContent,
    ],
    partials: [
        Partials.Reaction,
        Partials.Channel,
        Partials.GuildMember,
        Partials.Message,
        Partials.User,
    ],
});

if (!(process.env.API_URI && process.env.API_KEY && process.env.DISCORD_TOKEN)) {
    throw Error("Environment variable DISCORD_TOKEN, API_URI, API_KEY required.");
}

const apiClient = new ApiClient(process.env.API_URI, process.env.API_KEY);
// const localDateTimeProvider = new DateFnsLocalDateProvider(process.env.TZ ?? "Asia/Tokyo");

const bossQuestionnaireCache = new ThreadSafeCache<BossQuestionnaire>();

const random = new SeedRandomProvider()
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
        new RegisterCooperateChannelCommand(phraseRepository, client, apiClient),
        new RegisterUncompleteMemberRoleCommand(phraseRepository, client, apiClient),
        new BossSubjugationCommand(phraseRepository, client, apiClient),
        new RequestPinCommand(phraseRepository, client),
        new RequestUnpinCommand(phraseRepository, client),
        new DiceCommand(client, new BCDice()),
        new CalculateCarryOverTlCommand(phraseRepository, client),
        new SetupTimelineChannelCommand(phraseRepository, client, new SetupTimelineThreadChannelUsecase()),
        new OmikujiCommand(client, new LotteryBox(new CDateLocalDateProvider("Asia/Tokyo"), random, new RandomSortedFortuneTable(random)), phraseRepository)
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

const interactionEventHandler = new InteractionEventHandler([
    new BossSelectButtonCommand(phraseRepository),
    new StartChallengeCommand(apiClient, phraseRepository),
    new ChallengedTypeSelectCommand(phraseRepository),
    new OpenDamageInputFormCommand(phraseRepository, apiClient),
    new OpenCreateCarryOverFormCommand(phraseRepository),
    new OpenEditCarryOverCommand(apiClient, phraseRepository),
    new DeleteDamageReportCommand(apiClient, phraseRepository),
    new RequestRescueCommand(apiClient, phraseRepository),
    new DeleteCarryOverCommand(apiClient, phraseRepository),
    new RetryChallengeCommand(apiClient, phraseRepository),
    new SubmitReportDamageCommand(phraseRepository, apiClient),
    new SubmitRegisterCarryOverCommand(phraseRepository, apiClient),
    new SubmitEditCarryOverCommand(phraseRepository, apiClient),
    new OpenCreateTimelineThreadFormCommand(phraseRepository),
    new SubmitCreateTimelineThreadCommand(phraseRepository, new CreateTimelineThreadUsecase()),
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
