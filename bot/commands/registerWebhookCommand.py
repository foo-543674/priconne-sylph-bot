from discord.client import Client
from requests import status_codes
from apiClient import ApiClient
from typing import Match
from discord.message import Message
from command_spec import MessageCommand, PhraseRepository
import re
import requests


class RegisterWebhookCommand(MessageCommand):
    def __init__(self, phraseRepository: PhraseRepository, apiClient: ApiClient) -> None:
        super().__init__(phraseRepository)
        self.apiClient = apiClient

    def isMatchTo(self, message: str):
        return re.search(self.phraseRepository.get('register_webhook'), message)

    async def execute(self, message: Message, discordClient: Client) -> None:
        print('start register webhook command')
        messageText: str = re.sub(
            f"@{self.phraseRepository.get('bot_name')}", '', message.clean_content).strip(" ")
        matches: Match = re.search(self.phraseRepository.get(
            'register_webhook'), messageText)
        clanName: str = matches.group('clanName')
        url: str = matches.group('url')

        response = self.apiClient.register_webhook(clanName, url)

        if(response.status_code == 200):
            await message.add_reaction(self.phraseRepository.get('succeed_reaction'))
        elif(response.status_code == 400):
            await message.channel.send(response.text)
        else:
            await message.add_reaction(self.phraseRepository.get('failed_reaction'))
