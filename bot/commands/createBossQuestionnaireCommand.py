
from discord.message import Message
from command_spec import MessageCommand, PhraseRepository
import re


class CreateBossQuestionnaireCommand(MessageCommand):
    def __init__(self, phraseRepository: PhraseRepository) -> None:
        super().__init__(phraseRepository)

    def isMatchTo(self, message: str):
        return re.search(self.phraseRepository.get('create_boss_questionnaire'), message)

    async def execute(self, message: Message) -> None:
        print('start create boss querstionaire command')
        sentMessage: Message = await message.channel.send(self.phraseRepository.get('boss_questionnaire_message'))
        reactions = [
            self.phraseRepository.get('1_boss_stamp'),
            self.phraseRepository.get('2_boss_stamp'),
            self.phraseRepository.get('3_boss_stamp'),
            self.phraseRepository.get('4_boss_stamp'),
            self.phraseRepository.get('5_boss_stamp'),
        ]
        for reaction in reactions:
            await sentMessage.add_reaction(reaction)
