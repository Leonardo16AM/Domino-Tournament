from github import Github
import json
import os
import sys

REPO_NAME = "UH-GIA02/Domino-Tournament"
FILE_PATH = "src/data/players.json"

g = Github(os.environ['SUPER_TOKEN'])
domino_repo = g.get_repo(REPO_NAME)

def update_players_file(user_name, repo_url):
    contents = domino_repo.get_contents(FILE_PATH)
    players = json.loads(contents.decoded_content)

    player_found = False
    for player in players:
        if player['github_user'] == user_name:
            player['repo'] = repo_url
            player_found = True
            break

    if not player_found:
        players.append({"github_user": user_name, "games_played": [], "repo": repo_url})

    domino_repo.update_file(
        contents.path,
        "Actualización de jugador por PR",
        json.dumps(players, indent=4),
        contents.sha
    )

def main():
    if len(sys.argv) != 3:
        print("Use: new_repo.py <user> <url_pr>")
        sys.exit(1)

    user_name = sys.argv[1]
    repo_url = sys.argv[2]

    update_players_file(user_name, repo_url)

if __name__ == "__main__":
    main()
