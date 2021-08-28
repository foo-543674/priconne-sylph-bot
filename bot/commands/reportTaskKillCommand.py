
from discord.raw_models import RawReactionActionEvent
from apiClient import ApiClient
from command_spec import PhraseRepository, ReactionCommand


class ReportTaskKillCommand(ReactionCommand):
    def __init__(self, phraseRepository: PhraseRepository, apiClient: ApiClient) -> None:
        super().__init__(phraseRepository)
        self.apiClient = apiClient

    def isMatchTo(self, reaction: str, messageId: str) -> bool:
        response = self.apiClient.get_report_message(messageId)

        if(response.status_code == 200):
            return (
                reaction == self.phraseRepository.get('task_kill_stamp')
            )
        else:
            return False

    def executeForAdd(self, reaction: RawReactionActionEvent) -> None:
        print("report task kill")
        self.apiClient.report_task_kill(reaction.message_id, reaction.user_id)

    def executeForRemove(self, reaction: RawReactionActionEvent) -> None:
        print("cancel task kill")
        self.apiClient.cancel_task_kill(reaction.message_id, reaction.user_id)