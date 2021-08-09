import yaml
from command_spec import PhraseRepository


class YamlPhraseRepository(PhraseRepository):
    def __init__(self, configPath: str) -> None:
        super().__init__()
        self.configPath = configPath

    def get(self, alias: str) -> str:
        with open(self.configPath) as source:
            config = yaml.safe_load(source)
            commandPhrases = config['phrases']
            return commandPhrases.get(alias, "")