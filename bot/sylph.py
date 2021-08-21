from command_spec import MessageCommand
from discord import Client, Message, RawReactionActionEvent


class Sylph(Client):
    def __init__(self, *, loop=None, **options):
        super().__init__(loop=loop, **options)
        self.commands: list[MessageCommand] = []

    def add_message_command(self, command: MessageCommand):
        self.commands.append(command)

    async def on_ready(self):
        print('Logged on as', self.user)

    async def on_message(self, message: Message):
        if self.user not in message.mentions:
            return

        for command in self.commands:
            if not command.isMatchTo(message.clean_content):
                continue
            await command.execute(message, self)

    async def on_raw_reaction_add(self, payload: RawReactionActionEvent):
        if payload.member == self.user:
            return
        print(payload)

    async def on_raw_reaction_remove(self, payload: RawReactionActionEvent):
        print(payload)
