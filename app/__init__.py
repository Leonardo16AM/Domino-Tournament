# flask-api/flaskr/__init__.py
from flask import Flask, request

app = Flask("play-the-frist-one")
app.game_logs = []
print(__name__)

@app.route("/start", methods=["GET"])
def start():
    # True if you would like to be the 1st player in the game
    # False otherwise
    return {
        "start": True
    }

@app.route("/reset", methods=["POST"])
def reset():
    # get player data and game configuration
    app.game_data = request.get_json()
    return "ok", 200

@app.route("/step", methods=["POST"])
def step():
    def message(piece, head):
        return {
            "piece": piece,
            "head": head
        }
    # get current heads on the table
    # you might already know them if you are paying attention to the logs
    [h1, h2] = request.get_json()
    # decide what to play
    pieces = app.game_data["pieces"]
    if h1 == -1:
        # heads = [-1, -1], meaning that it is the first move
        # any piece can be selected
        piece = pieces.pop(0)
        return message(piece, 0)
    for i in range(len(pieces)):
        x, y = pieces[i]
        if x==h1 or y == h1:
            pieces.pop(i)
            return message([x, y], 0)
        if x==h2 or y == h2:
            pieces.pop(i)
            return message([x, y], 1)
    return message(None, None)

@app.route("/log", methods=["POST"])
def log():
    # Do something with the events to get info of the game
    app.game_logs.append(request.get_json())
    return "ok", 200
