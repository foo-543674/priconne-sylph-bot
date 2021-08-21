
from typing import Match
from apiClient import ApiClient
from discord.client import Client
from discord.message import Message
from command_spec import MessageCommand, PhraseRepository
import re


class CreateChallengeReportCommand(MessageCommand):
    def __init__(self, phraseRepository: PhraseRepository, apiClient: ApiClient) -> None:
        super().__init__(phraseRepository)
        self.apiClient = apiClient

    def isMatchTo(self, message: str):
        return re.search(self.phraseRepository.get('create_challenge_report'), message)

    async def execute(self, message: Message) -> None:
        print('start create challenge report command')
        await message.channel.send(self.phraseRepository.get('challenge_report_guide'))

        messageText: str = re.sub(
            f"@{self.phraseRepository.get('bot_name')}", '', message.clean_content).strip(" ")
        matches: Match = re.search(self.phraseRepository.get(
            'create_challenge_report'), messageText)
        clanName: str = matches.group('clanName')
        messageIds = list()
        for day in range(1, 6):
            sentMessage: Message = await message.channel.send(self.phraseRepository.get('days_unit').format(day))
            messageIds.append(str(sentMessage.id))
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

        response = self.apiClient.register_report_message(
            clanName,
            str(message.channel.id),
            messageIds
        )

        if(response.status_code == 200):
            await message.add_reaction(self.phraseRepository.get('succeed_reaction'))
        elif(response.status_code == 400):
            await message.channel.send(response.text)
        else:
            await message.add_reaction(self.phraseRepository.get('failed_reaction'))
