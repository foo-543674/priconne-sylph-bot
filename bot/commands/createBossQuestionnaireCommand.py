
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
        await message.channel.send(self.phraseRepository.get('boss_questionnaire_message'))

        for day in range(1, 6):
            sentMessage: Message = await message.channel.send(self.phraseRepository.get('boss_questionnaire_message'))
            reactions = [
                self.phraseRepository.get('first_boss_stamp'),
                self.phraseRepository.get('second_boss_stamp'),
                self.phraseRepository.get('third_boss_stamp'),
                self.phraseRepository.get('forth_boss_stamp'),
                self.phraseRepository.get('fifth_boss_stamp'),
            ]
            for reaction in reactions:
                await sentMessage.add_reaction(reaction)
