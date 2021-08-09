from repository import YamlPhraseRepository
from message_command import CreateChallengeReportCommand
import os
from sylph import Sylph


client = Sylph()

phraseRepository = YamlPhraseRepository(f'{os.path.dirname(os.path.abspath(__file__))}/config.yaml')
createChallengeReportCommand = CreateChallengeReportCommand(phraseRepository)

client.add_message_command(createChallengeReportCommand)

client.run(os.environ.get('DISCORD_TOKEN'))