from abc import ABCMeta, abstractmethod
from discord import Message
from discord.client import Client
from discord.enums import Enum
from discord.raw_models import RawReactionActionEvent


class PhraseRepository(metaclass=ABCMeta):
    @abstractmethod
    def get(self, alias: str) -> str:
        """
        指定されたエイリアスに対応するフレーズを取得する。

        Parameters
        ------------
        alias : str
            取得したいフレーズのエイリアス
        """
        pass


class MessageCommand(metaclass=ABCMeta):
    """
    メッセージを受信した際に実行されるコマンド
    """

    def __init__(self, phraseRepository: PhraseRepository) -> None:
        """
        Parameters
        ------------
        phraseRepository : CommandPhraseRepository
            コマンドのフレーズが格納されたリポジトリ
        """
        self.phraseRepository = phraseRepository

    @abstractmethod
    def isMatchTo(self, message: str) -> bool:
        """
        メッセージの内容がこのコマンドに対応したフレーズになってるか確認

        Parameters
        ------------
        message : str
            受信したメッセージの内容
        """
        pass

    @abstractmethod
    async def execute(self, message: Message) -> None:
        """
        メッセージに対する反応をする

        Parameters
        ------------
        message : Message
            受信したメッセージ
        """
        pass

class ReactionCommand(metaclass=ABCMeta):
    """
    リアクションを受信した際に実行されるコマンド
    """

    def __init__(self, phraseRepository: PhraseRepository) -> None:
        """
        Parameters
        ------------
        phraseRepository : CommandPhraseRepository
            コマンドのフレーズが格納されたリポジトリ
        """
        self.phraseRepository = phraseRepository

    @abstractmethod
    def isMatchTo(self, reaction: str, messageId: str) -> bool:
        """
        リアクションの内容とメッセージに対応したコマンドかどうか確認

        Parameters
        ------------
        reaction : str
            受信したリアクション
        messageId : str
            リアクションされたメッセージのID
        """
        pass

    @abstractmethod
    def executeForAdd(self, reaction: RawReactionActionEvent) -> None:
        """
        リアクションが追加されたことに対する反応をする

        Parameters
        ------------
        reaction : RawReactionActionEvent
            リアクションの内容
        """
        pass

    @abstractmethod
    def executeForRemove(self, reaction: RawReactionActionEvent) -> None:
        """
        リアクションが削除されたことに対する反応をする

        Parameters
        ------------
        reaction : RawReactionActionEvent
            リアクションの内容
        """
        pass
