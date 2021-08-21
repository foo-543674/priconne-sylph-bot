from typing import List
from discord.member import Member
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

    def register_members(self, clanName: str, members: List[Member]) -> Response:
        return requests.post(
            f"{self.baseUri}/api/members",
            json.dumps({
                "clanName": clanName,
                "users": [{"discordId": str(member.id), "name": member.display_name} for member in members]
            }),
            headers={
                'Content-Type': 'application/json',
                'X-Authorization': self.apiKey
            }
        )

    def register_report_message(self, clanName: str, channelId: str, memberIds: List[str]) -> Response:
        return requests.post(
            f"{self.baseUri}/api/report_channels",
            json.dumps({
                "clanName": clanName,
                "discordChannelId": channelId,
                "discordMessageIds": memberIds
            }),
            headers={
                'Content-Type': 'application/json',
                'X-Authorization': self.apiKey
            }
        )

    def register_webhook(self, clanName: str, destination: str):
        return requests.post(
            f"{self.baseUri}/api/webhooks",
            json.dumps({
                "clanName": clanName,
                "destination": destination,
            }),
            headers={
                'Content-Type': 'application/json',
                'X-Authorization': self.apiKey
            }
        )
