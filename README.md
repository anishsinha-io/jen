### Jen

a blog for jenny and me

### Requisite Technology

This project recommends Docker to be installed for the best experience. If you are unwilling or unable to install
docker, click [here](#building-without-docker).

Otherwise, please navigate
to [the official website](https://docs.docker.com/get-docker/) and install Docker for your operating system. Once docker
is installed, please run

`docker --version`

to ensure that the CLI works.

### Building With Docker

Clone this repository into the directory of your choosing

`git clone git@github.com:anish-sinha1/jen.git`

If you don't have SSH keys set up, run

`git clone https://github.com/anish-sinha1/jen.git`

to clone over HTTPS instead.

`cd` into the directory you just cloned.

Run the setup script with python: `python scripts/setup_dev_env.py`, which will generate a `.env.generated` file which contains a randomly generated secret key for Flask, and an RSA key pair for signing JSON Web Tokens issued by the backend server. **You must have OpenSSL installed for the script to work!**.

If the above step completed correctly, please run `mv server/.env.generated server/.env` and run `docker compose up`. You can skip the section below about working around not having OpenSSL.

**If you do not have OpenSSL**, please create a file called .env and copy the following into it:

```environment variables
LAUNCH_MODE="development"
SECRET_KEY=""
PG_USER="postgres"
PG_PASSWORD="postgres"
PG_HOST="postgres"
PG_PORT="5432"
PG_DB="postgres"
PG_OPTS="connect_timeout=10"
REDIS_HOST="redis"
REDIS_PORT="6379"

RSA_PUBLIC_KEY=""
RSA_PRIVATE_KEY=""

HASH_ALGORITHM="argon2"
TOKEN_ISS="https://anishsinha.io"
TOKEN_AUD="https://anishsinha.io"
```

Please generate a public/private key pair by navigating to this website: [cryptotools](https://cryptotools.net/rsagen#:~:text=To%20generate%20a%20key%20pair,take%20up%20to%20several%20minutes.) and creating one from there. If you went this route, you're going to need to convert the keys into one line each, so you can use the following python code for that:

```python
with open("path-to-key-file", "r") as f:
    key = "".join((line.strip() + r"\n") for line in f)
    key = key[:-2]

print(key)
```

Just copy/paste that into a file and edit path-to-file. Your key should be printed out in your terminal. You can copy and paste that into the correct .env fields.

To generate a secret key, run `python -c "import secrets;print(secrets.token_urlsafe(512))"` and paste the result into the .env file under the appropriate key. Now you're done!

Once this is done, run

`docker compose up` in the root of the project (where the `docker-compose.yml file exists`) and you should be good to go.

### License

This code is licensed under the BSD 0 Clause License.
