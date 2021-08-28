import discord
from apiClient import ApiClient
from repository import YamlPhraseRepository
from commands.bossNotificationCommand import BossNotificationCommand
from commands.createChallengeReportCommand import CreateChallengeReportCommand
from commands.createBossQuestionnaireCommand import CreateBossQuestionnaireCommand
from commands.registerClanCommand import RegisterClanCommand
from commands.registerMembersCommand import RegisterMembersCommand
from commands.registerWebhookCommand import RegisterWebhookCommand
from commands.reportTaskKillCommand import ReportTaskKillCommand
from commands.reportCarryOverCommand import ReportCarryOverCommand
from commands.reportChallengeCommand import ReportChallengeCommand
import os
from sylph import Sylph


intents = discord.Intents.default()
intents.members = True
client = Sylph(intents=intents)

phraseRepository = YamlPhraseRepository(
    f'{os.path.dirname(os.path.abspath(__file__))}/config.yaml')
apiClient = ApiClient(os.environ.get('API_URI'), os.environ.get('API_KEY'))

client.add_message_command(RegisterClanCommand(phraseRepository, apiClient))
client.add_message_command(RegisterMembersCommand(phraseRepository, apiClient))
client.add_message_command(
    CreateChallengeReportCommand(phraseRepository, apiClient))
client.add_message_command(RegisterWebhookCommand(phraseRepository, apiClient))
client.add_message_command(CreateBossQuestionnaireCommand(phraseRepository))
client.add_message_command(BossNotificationCommand(phraseRepository, client))

client.add_reaction_command(
    ReportChallengeCommand(phraseRepository, apiClient))
client.add_reaction_command(
    ReportCarryOverCommand(phraseRepository, apiClient))
client.add_reaction_command(
    ReportTaskKillCommand(phraseRepository, apiClient))

client.run(os.environ.get('DISCORD_TOKEN'))
