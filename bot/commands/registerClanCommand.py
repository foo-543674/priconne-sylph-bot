from apiClient import ApiClient
from typing import Match
from discord.message import Message
from command_spec import MessageCommand, PhraseRepository
import re
import requests


class RegisterClanCommand(MessageCommand):
    def __init__(self, phraseRepository: PhraseRepository, apiClient: ApiClient) -> None:
        super().__init__(phraseRepository)
        self.apiClient = apiClient

    def isMatchTo(self, message: str):
        return re.match(self.phraseRepository.get('register_clan'), message)

    async def execute(self, message: Message) -> None:
        messageText: str = re.sub(
            f"@{self.phraseRepository.get('bot_name')}", '', message.clean_content).strip(" ")
        matches: Match = re.match(self.phraseRepository.get(
            'register_clan'), messageText)
        clanName: str = matches.group('clanName')

        response = self.apiClient.register_clan(clanName)

        if(response.status_code == 200):
            await message.add_reaction(self.phraseRepository.get('succeed_reaction'))
        else:
            await message.channel.send(response.text)
