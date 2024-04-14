import requests, base64

def fetch_spotify_token(client_id="0619c1f2aa5d4d97b2da4d1a2926cf73", client_secret="db6d29a6da284e878236d9c2f5dff05a"):
    url = "https://accounts.spotify.com/api/token"
    headers = {
        "Content-Type": "application/x-www-form-urlencoded",
        "Authorization": "Basic " + base64.b64encode(f"{client_id}:{client_secret}".encode()).decode()
    }

    data = {
        'grant_type': 'authorization_code',
        'redirect_uri': 'http://localhost:8081',
        'code': "AQACZufJIh4GbPYKSSHpnalL5QcW49FI-BXxy4vNerFyePM51moTSTMqxmYJWAyYcdj4F6fpXfM-nwxka2RuTCegxBq2qIA7PuqDp9PbQScryNN7Y_yAef98HcCMD-dBwgj_P0njT_2tL_YWm0KGp5Z2C77XM8eCH2fiwiqaZh9RErfmZoP6p0XhOBJ5wayMAfItF0VLZ_f5Ka_UYe7Ti4xwXI8BRvJ7nrkA-R1TDGpQ0h8OQda4BbquOlnu0iug9T4jVrdLeJnK7jmDWKGdMxQdsGm9SKYxocM5oT8bODElrksHWkPkX9jrdDmg3E5Wt-HL_SoEoB81g368JH0nOESXQqOiW4d4yRNMwxmh-D5wYO7NgSQySou_D2iu_ZtEqeJp8MRua_3GjHtM-Do"
    }

    response = requests.post(url, headers=headers, data=data)

    return response.json()

print(fetch_spotify_token())