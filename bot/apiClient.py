import requests
import json
from requests.models import Response


class ApiClient:
    def __init__(self, baseUri: str, apiKey: str):
        self.baseUri = baseUri.rstrip('/')
        self.apiKey = apiKey

    def register_clan(self, name: str) -> Response:
        return requests.post(
            f"{self.baseUri}/api/clans",
            json.dumps({"clanName": name}),
            headers={
                'Content-Type': 'application/json',
                'X-Authorization': self.apiKey
            }
        )