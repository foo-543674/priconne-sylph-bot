
from discord.raw_models import RawReactionActionEvent
from apiClient import ApiClient
from command_spec import PhraseRepository, ReactionCommand


class ReportChallengeCommand(ReactionCommand):
    def __init__(self, phraseRepository: PhraseRepository, apiClient: ApiClient) -> None:
        super().__init__(phraseRepository)
        self.apiClient = apiClient

    def isMatchTo(self, reaction: str, messageId: str) -> bool:
        response = self.apiClient.get_report_message(messageId)

        if(response.status_code == 200):
            return (
                reaction == self.phraseRepository.get('first_challenge_stamp')
                or reaction == self.phraseRepository.get('second_challenge_stamp')
                or reaction == self.phraseRepository.get('third_challenge_stamp')
            )
        else:
            return False

    def executeForAdd(self, reaction: RawReactionActionEvent) -> None:
        print("report challenge")
        self.apiClient.report_challenge(reaction.message_id, reaction.user_id)

    def executeForRemove(self, reaction: RawReactionActionEvent) -> None:
        print("cancel challenge")
        self.apiClient.cancel_challenge(reaction.message_id, reaction.user_id)
