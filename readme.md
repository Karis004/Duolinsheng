## green bird i love you

- Read the txt word book exported from the Eudic dictionary and process it into excel file.
- Follow the **Ebbinghaus memory curve** for word learning.
- Alternative study plans.
- After I finished writing, I found that this function is the same as Anki card, so if you want to know more about this project, please refer to the official website of Anki (https://apps.ankiweb.net/).
  - This project is Anki lite, of course.
- Add review feature, mistakes book feature.

## Docker port mapping

`docker-compose.yml` publishes host port **8081** to port **80** inside the
container. The Python server in `run.py` continues listening on container port 80.
The mapping order is `HOST_PORT:CONTAINER_PORT`.

Validate the configuration without building or starting a container:

```sh
docker compose config --quiet
```

## Persistent learning records

Compose bind-mounts the server's `./data` directory at `/app/data`. Excel learning
records (`record-*.xlsx`), daily review files (`today_words-*.txt`), and the optional
scheduler log are stored there. Recreating or rebuilding the container keeps these
host files. `DUOLINSHENG_DATA_DIR` selects the data directory; direct local Python
execution defaults to the current directory for existing installations.

`./SendKey.py` is mounted separately at `/app/SendKey.py`, read-only. Keep this
private configuration on the server; Git and the Docker build context exclude it.
The data directory, learning records, and backups are also excluded from both.
Create the host directory and supply the private configuration before starting:

```sh
mkdir -p data
```

For an existing installation without data mounts, first stop writes and back up
the latest records from the **running container**, not just the repository folder.
Copy those records into `./data` and preserve its `/app/SendKey.py` as `./SendKey.py`.
Then pull the reviewed GitHub commit and recreate the service:

```sh
git pull --ff-only origin main
docker compose up -d --build --wait --wait-timeout 120 run
```

Check the learning files and website after deployment. Bind mounts protect records
across container replacement; keep separate backups against host disk loss or
accidental file deletion. The Compose service starts the website only; it does not
start `scheduler.py` or enable reminder messages.

Run the isolated record-storage checks without Docker or real credentials:

```sh
python -m unittest discover -s tests -v
```

![evil bird](https://i.ibb.co/7ytzHmt/983331e25477d704dcd3613bc57a026-transformed.png)
