
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
        questionaireMessage: Message = message.channel.fetch_message(questionaireMessageId)

        messageText: str = re.sub(
            f"@{self.phraseRepository.get('bot_name')}", '', message.clean_content).strip(" ")
        matches: Match = re.search(self.phraseRepository.get(
            'boss_notification_command'), messageText)
        bossNumber: str = matches.group('boss_number')
        bossNumberEmoji = self.phraseRepository.get(f"{bossNumber}_boss_stamp")
        notifyReactions: List[Reaction] = filter(lambda reaction: reaction.emoji == bossNumberEmoji,
                                questionaireMessage.reactions)
        members = itertools.chain(map(lambda reaction: reaction.users(), notifyReactions))
        mentions = map(lambda member: f"<@{member.id}>", members)
        memtionText = ".".join(mentions)

        await message.channel.send(f"{memtionText}{self.phraseRepository.get('boss_notify_message')}")

