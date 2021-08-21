from typing import List
from command_spec import MessageCommand, ReactionCommand
from discord import Client, Message, RawReactionActionEvent


class Sylph(Client):
    def __init__(self, *, loop=None, **options):
        super().__init__(loop=loop, **options)
        self.commands: list[MessageCommand] = []
        self.reactionCommands: List[ReactionCommand] = []

    def add_message_command(self, command: MessageCommand):
        self.commands.append(command)

    def add_reaction_command(self, command: ReactionCommand):
        self.reactionCommands.append(command)

    async def on_ready(self):
        print('Logged on as', self.user)

    async def on_message(self, message: Message):
        if self.user not in message.mentions:
            return

        for command in self.commands:
            if not command.isMatchTo(message.clean_content):
                continue
            await command.execute(message)

    async def on_raw_reaction_add(self, payload: RawReactionActionEvent):
        if payload.member == self.user:
            return

        for command in self.reactionCommands:
            if not command.isMatchTo(payload.emoji.name, payload.message_id):
                continue
            command.executeForAdd(payload)

    async def on_raw_reaction_remove(self, payload: RawReactionActionEvent):
        if payload.member == self.user:
            return

        for command in self.reactionCommands:
            if not command.isMatchTo(payload.emoji.name, payload.message_id):
                continue
            command.executeForRemove(payload)
