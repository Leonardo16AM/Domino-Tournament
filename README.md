# Example remote domino player

This is an example player to connect to the cooperAItive remote domino player ([here](https://github.com/2kodevs/cooperAItive/blob/master/src/games/domino/module/players/strategies/remote.py))

You can build the image with

```
docker build . --tag example
```

Then you can run it with

```
docker run --rm -p 127.0.0.1:5000:8000 example
```

This will expose the container port `8000` to `127.0.0.1:5000`, so you can provide that url to the Remote player and try it out
