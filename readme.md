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

Changing the mapping takes effect when the container is recreated. Before
redeploying an existing installation, back up its current learning records
(`/app/record-*.xlsx` and `/app/today_words-*.txt`) and local configuration
(`/app/SendKey.py`). These files are not tracked by Git, and the existing server
container has no persistent data mount. Also review any server-side Git changes
and its existing Compose file before pulling or rebuilding.

![evil bird](https://i.ibb.co/7ytzHmt/983331e25477d704dcd3613bc57a026-transformed.png)
