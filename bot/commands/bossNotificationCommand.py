
from typing import List, Match
from discord.message import Message
from discord import Client as DiscordClient
from discord.reaction import Reaction
import itertools
from command_spec import MessageCommand, PhraseRepository
import re


class BossNotificationCommand(MessageCommand):
    def __init__(self, phraseRepository: PhraseRepository, discordClient: DiscordClient) -> None:
        super().__init__(phraseRepository)
        self.discordClient=discordClient

    def isMatchTo(self, message: str):
        return re.search(self.phraseRepository.get('boss_notification_command'), message)

    async def execute(self, message: Message) -> None:
        print('start boss notification command')
        questionaireMessageId = message.reference.message_id
        questionaireMessage: Message = await message.channel.fetch_message(questionaireMessageId)

        messageText: str = re.sub(
            f"@{self.phraseRepository.get('bot_name')}", '', message.clean_content).strip(" ")
        matches: Match = re.search(self.phraseRepository.get(
            'boss_notification_command'), messageText)
        bossNumber: str = matches.group('bossNumber')
        bossNumberEmoji = self.phraseRepository.get(f"{bossNumber}_boss_stamp")
        notifyReactions = [reaction for reaction in questionaireMessage.reactions if reaction.emoji == bossNumberEmoji]
        users = itertools.chain([await reaction.users().flatten() for reaction in notifyReactions])
        #mentions = [f"<@{user.id}>" for user in users]
        memtionText = ".".join(users)

        await message.channel.send(f"{memtionText}{bossNumber}{self.phraseRepository.get('boss_notify_message')}")
