from github import Github
import json
import os

REPO_NAME = "UH-GIA02/Example-Domino-Remote-Player"
FILE_PATH = "src/data/players.json"

g = Github(os.environ['GITHUB_TOKEN'])
repo = g.get_repo(REPO_NAME)

def update_players_file(pr):
    # Cargar el archivo JSON de jugadores
    domino_repo = g.get_repo("UH-GIA02/Domino-Tournament")
    contents = domino_repo.get_contents(FILE_PATH)
    players = json.loads(contents.decoded_content)

    # Buscar o crear el jugador
    user = pr.user.login
    repo_url = pr.html_url
    player_found = False
    for player in players:
        if player['github_user'] == user:
            player['repo'] = repo_url
            player_found = True
            break
    
    if not player_found:
        players.append({"github_user": user, "games_played": [], "repo": repo_url})

    # Guardar el archivo actualizado
    domino_repo.update_file(
        contents.path,
        "Actualización de jugador por PR",
        json.dumps(players, indent=4),
        contents.sha
    )

# Obtener los PRs
pulls = repo.get_pulls(state='open', sort='created')
for pr in pulls:
    update_players_file(pr)
