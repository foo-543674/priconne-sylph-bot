SINCE=$(date +'%Y-%m-%d')
UNTIL=$(date -d '4 days' +'%Y-%m-%d')


curl -X POST -H "Content-Type: application/json" -H "X-Authorization: $API_KEY" -d "{\"since\":\"$SINCE\", \"until\":\"$UNTIL\"}" http://localhost:8000/api/clan_battles