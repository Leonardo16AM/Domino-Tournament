import json
import subprocess
from termcolor import colored
from collections import defaultdict
import ast

def load_teams(file_json):
    with open(file_json, 'r') as f:
        teams = json.load(f)
    return teams


def start_new_player(team,container_id,port,image_name):
    print(f"Corriendo el contenedor {container_id}...")
    run_player = f"docker run -d --rm -p 127.0.0.1:{port}:8000 --name {container_id} {image_name}"
    subprocess.run(run_player, shell=True)

    print(colored(f'team: {team["nombre_equipo"]}', 'yellow'))
    print(colored(f'Integrante: {team["integrante"]}', 'yellow'))
    print(colored(f'Container ID: {container_id}', 'cyan'))
    print(colored(f'Puerto asignado: {port}', 'green'))

def start_players(teams):
    port = 5000  
    successful_teams=[]
    for team in teams: 
        image_name = f"{team['nombre_equipo']}_{team['integrante']}".lower()
        repo = team['repo']
        print("===================================================")
        print(f"Construyendo la imagen Docker para {image_name}...")
        docker_build = f"docker build -t {image_name} '{repo}.git'"
        build_out = subprocess.run(docker_build, shell=True)

        if build_out.returncode == 0:
            team['container_id']=[f"{image_name}_{1}",f"{image_name}_{2}"]
            team['ports']=[port,port+1]
            for i in range(1, 3):  
                container_id = f"{image_name}_{i}"
                start_new_player(team,container_id,port,image_name)
                port += 1
            successful_teams.append(team)
        else:
            print(f"Falló la construcción de la imagen para {image_name}. Saltando...")

    return successful_teams

def save_dict_to_json(d, filename):
    try:
        with open(filename, 'w', encoding='utf-8') as f:
            json.dump(d, f, ensure_ascii=False, indent=4)
        print(f"Diccionario guardado exitosamente en {filename}")
    except Exception as e:
        print(f"Ocurrió un error al guardar el diccionario: {e}")


def load_and_start_players():
    file_json = 'teams.json'
    teams = load_teams(file_json)

    successful_teams = start_players(teams)
    save_dict_to_json(successful_teams,"team_containers.json")
    print(colored(successful_teams,'magenta'))
    return successful_teams


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

def run_game(p0, p1, p2, p3):           # la linea de abajo puede dar bateo con el path, xq es relativo OJO xd
    cmd = f"python3 domino/domino.py play -p0 Remote http://127.0.0.1:{p0} -p1 Remote http://127.0.0.1:{p1} -p2 Remote http://127.0.0.1:{p2} -p3 Remote http://127.0.0.1:{p3} -v"
  
    completed_process = subprocess.run(cmd, shell=True, capture_output=True, text=True)

    if completed_process.returncode != 0:
        print(f"Error running command: {completed_process.stderr}")
        return {}

    try:
        return parse_output(completed_process.stdout)
    except json.JSONDecodeError:
        print(f"Invalid output: {completed_process.stdout}")
        return {}

def play_tournament(teams,min_rounds):

    if len(teams)<=1:
        if len(teams)==1:
            print(f"The winner is : {teams[0]['integrante']}")
        if len(teams)==0:
            print("no teams :<")
        return

    integrantes={}
    scoreboard=defaultdict(lambda: {'score': 0,'wins': 0, 'ties': 0})

    for round in range(1000):
        for i, team_a in enumerate(teams):
            for j, team_b in enumerate(teams[i+1:], start=i+1): 
                print(f"Playing games between {team_a['nombre_equipo']} and {team_b['nombre_equipo']}")
            
                result = run_game(team_a['ports'][0], team_b['ports'][0], team_a['ports'][1], team_b['ports'][1])
                print(result)
                scoreboard[team_a['nombre_equipo']]['wins'] += result.get(0, 0)
                scoreboard[team_b['nombre_equipo']]['wins'] += result.get(1, 0)
                scoreboard[team_a['nombre_equipo']]['ties'] += result.get(-1, 0)
                scoreboard[team_b['nombre_equipo']]['ties'] += result.get(-1, 0)

        for i, team_a in enumerate(teams):
            scoreboard[team_a['nombre_equipo']]['score']=scoreboard[team_a['nombre_equipo']]['wins']*3;
            scoreboard[team_a['nombre_equipo']]['score']+=scoreboard[team_a['nombre_equipo']]['ties'];
            integrantes[team_a['nombre_equipo']]=team_a['integrante']
        
        sorted_scoreboard = sorted(scoreboard.items(), key=lambda x: (x[1]['score'], x[1]['wins']), reverse=True)
        
        print(colored("###################################################",'green'))
         
        print(colored( f"Scoreboard Round #{round+1}:" ,'yellow'))
   
        scoreboard_data = {}
        for rank, (team, stats) in enumerate(sorted_scoreboard, 1):
            print(f"{rank}. {team} ({integrantes[team]}) - Score: {stats['score']}, Wins: {stats['wins']}, Ties: {stats['ties']}")
            scoreboard_data[team] = stats
        print(colored("###################################################",'green'))

        if round>=min_rounds:
            if len(teams)>=4:
                if sorted_scoreboard[0][1]['score'] > sorted_scoreboard[1][1]['score'] > sorted_scoreboard[2][1]['score'] > sorted_scoreboard[3][1]['score']:
                    break
            elif len(teams)>=3:
                if sorted_scoreboard[0][1]['score'] > sorted_scoreboard[1][1]['score'] > sorted_scoreboard[2][1]['score']:
                    break
            elif sorted_scoreboard[0][1]['score'] > sorted_scoreboard[1][1]['score']:       #there'll always be at least 2 teams
                break
            

    # Save to JSON file
    with open('scoreboard_preview.json', 'w') as json_file:
        json.dump(scoreboard_data, json_file, indent=4)


def main():
    teams = load_and_start_players()
    # teams=load_teams('team_containers.json')
    min_rounds=4        #cantidad minima de rondas de todos contra todos, si hay pocos equipos, es sensato hacer muchas rondas
    play_tournament(teams,min_rounds)

if __name__ == "__main__":
    main()
