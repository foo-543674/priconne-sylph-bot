from apiClient import ApiClient
from repository import YamlPhraseRepository
from commands.createChallengeReportCommand import CreateChallengeReportCommand
from commands.registerClanCommand import RegisterClanCommand
import os
from sylph import Sylph


client = Sylph()

phraseRepository = YamlPhraseRepository(
    f'{os.path.dirname(os.path.abspath(__file__))}/config.yaml')
apiClient = ApiClient(os.environ.get('API_URI'), os.environ.get('API_KEY'))

client.add_message_command(RegisterClanCommand(phraseRepository, apiClient))
client.add_message_command(CreateChallengeReportCommand(phraseRepository))

client.run(os.environ.get('DISCORD_TOKEN'))
