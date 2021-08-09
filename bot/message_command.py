
from discord.message import Message
from command_spec import MessageCommand


class CreateChallengeReportCommand(MessageCommand):
    def isMatchTo(self, message: str):
        return self.phraseRepository.get('create_challenge_report') in message

    async def execute(self, message: Message) -> None:
        await message.channel.send(self.phraseRepository.get('challenge_report_guide'))
        for day in range(1, 6):
            sentMessage: Message = await message.channel.send(self.phraseRepository.get('days_unit').format(day))
            reactions = [
                self.phraseRepository.get('first_challenge_stamp'),
                self.phraseRepository.get('second_challenge_stamp'),
                self.phraseRepository.get('third_challenge_stamp'),
                self.phraseRepository.get('first_carry_over_stamp'),
                self.phraseRepository.get('second_carry_over_stamp'),
                self.phraseRepository.get('task_kill_stamp'),
            ]
            for reaction in reactions:
                await sentMessage.add_reaction(reaction)
