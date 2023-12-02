import json
import os
import sys

import subprocess
from termcolor import colored
from collections import defaultdict
import ast
import requests


FILE_PATH = "src/data/players.json"


def update_players_file(user_name, repo_url):
    # Leer el archivo JSON existente
    with open(FILE_PATH, 'r') as file:
        players = json.load(file)

    # Actualizar o añadir datos del jugador
    player_found = False
    for player in players:
        if player['github_user'] == user_name:
            player['repo'] = repo_url
            player_found = True
            break

    if not player_found:
        players.append({"github_user": user_name, "games_played": [], "repo": repo_url})

    # Escribir los cambios en el archivo JSON
    with open(FILE_PATH, 'w') as file:
        json.dump(players, file, indent=4)
    print("Players.json updated")


def start_new_player(container_id,port,image_name):
    print(f"Corriendo el contenedor {container_id}...")
    run_player = f"docker run -d --rm -p 127.0.0.1:{port}:8000 --name {container_id} {image_name}"
    subprocess.run(run_player, shell=True)
    print(colored(f'Container ID: {container_id}', 'cyan'))
    print(colored(f'Puerto asignado: {port}', 'green'))


def parse_output(output_str):
    try:
        parsed_output = ast.literal_eval(output_str)
        if not isinstance(parsed_output, dict):
            print("La salida no es un diccionario")
            return None
        return parsed_output
    except (ValueError, SyntaxError):
        print("La salida no se pudo parsear")
        return None


def run_game(p1, p2, tipo):           # la linea de abajo puede dar bateo con el path, xq es relativo OJO xd
    cmd = f"python3 src/domino/domino.py play -p0 Remote http://127.0.0.1:{p1} -p1 {tipo} -p2 Remote http://127.0.0.1:{p2} -p3 {tipo} -v"
  
    completed_process = subprocess.run(cmd, shell=True, capture_output=True, text=True)

    if completed_process.returncode != 0:
        print(f"Error running command: {completed_process.stderr}")
        return {}

    try:
        return parse_output(completed_process.stdout)
    except json.JSONDecodeError:
        print(f"Invalid output: {completed_process.stdout}")
        return {}
    

def get_repo_from_pull_request(pull_request_url):
    # Obtener la API URL del pull request
    api_url = pull_request_url.replace("https://github.com/", "https://api.github.com/repos/")
    api_url = api_url.replace("/pull/", "/pulls/")

    # Hacer la solicitud a la API de GitHub
    response = requests.get(api_url)
    if response.status_code == 200:
        data = response.json()
        # Obtener el URL del repositorio
        repo_url = data['head']['repo']['html_url']
        return repo_url
    else:
        return "Error: No se pudo obtener información del pull request."

    
def main():
    if len(sys.argv) != 3:
        print("Use: new_repo.py <user> <url_pr>")
        sys.exit(1)

    user_name = sys.argv[1]
    repo_url =  get_repo_from_pull_request(sys.argv[2])
    p1=5000
    p2=5001
    docker_build1 = f"docker build -t {user_name.lower()+'_a'} '{repo_url}.git'"
    docker_build2 = f"docker build -t {user_name.lower()+'_b'} '{repo_url}.git'"
    build_out1 = subprocess.run(docker_build1, shell=True)
    build_out2 = subprocess.run(docker_build2, shell=True)

    if build_out1.returncode == 0 and build_out2.returncode == 0:

        start_new_player(user_name.lower()+'_a',p1,user_name.lower()+'_a')
        start_new_player(user_name.lower()+'_b',p2,user_name.lower()+'_b')

        tipos=['Agachao']
        for tipo in tipos:
            print(f"Playing games between {user_name} and {tipo}")
            result = run_game(p1,p2,tipo)
            print(result)
        

    update_players_file(user_name, repo_url)

if __name__ == "__main__":
    main()
