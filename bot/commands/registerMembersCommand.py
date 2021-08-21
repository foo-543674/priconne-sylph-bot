from itertools import chain
import discord
from discord.client import Client
from discord.guild import Guild
from discord.member import Member
from requests import status_codes
from apiClient import ApiClient
from typing import List, Match
from discord.message import Message
from discord.role import Role
from command_spec import MessageCommand, PhraseRepository
import re
import json


class RegisterMembersCommand(MessageCommand):
    def __init__(self, phraseRepository: PhraseRepository, apiClient: ApiClient) -> None:
        super().__init__(phraseRepository)
        self.apiClient = apiClient

    def isMatchTo(self, message: str):
        return re.search(self.phraseRepository.get('register_members'), message)

    async def execute(self, message: Message, discordClient: Client) -> None:
        print('start register members command')
        messageText: str = re.sub(
            f"@{self.phraseRepository.get('bot_name')}", '', message.clean_content).strip(" ")
        matches: Match = re.search(self.phraseRepository.get(
            'register_members'), messageText)
        clanName: str = matches.group('clanName')

        members = list(chain.from_iterable(
            [r.members for r in message.role_mentions]))
        response = self.apiClient.register_members(clanName, members)
        if(response.status_code == 200):
            await message.add_reaction(self.phraseRepository.get('succeed_reaction'))
        elif(response.status_code == 400):
            await message.channel.send(response.text)
        else:
            await message.add_reaction(self.phraseRepository.get('failed_reaction'))
