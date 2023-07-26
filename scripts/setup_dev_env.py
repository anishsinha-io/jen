import os
import secrets

WORKDIR = os.path.dirname(os.path.abspath(__file__))

path_to_server = f"{WORKDIR}/../server"

env_file_path = path_to_server + "/.env.generated"

print(env_file_path)

secret = secrets.token_urlsafe(512)

os.system("openssl genrsa -out keypair.pem 4096 &>/dev/null")
os.system("openssl rsa -in keypair.pem -pubout -out publickey.crt &>/dev/null")

with open("./keypair.pem", "r") as f:
    private_key = "".join((line.strip() + r"\n") for line in f)
    private_key = private_key[:-2]

with open("./publickey.crt", "r") as f:
    public_key = "".join((line.strip() + r"\n") for line in f)
    public_key = public_key[:-2]

os.remove("./keypair.pem")
os.remove("./publickey.crt")

env = f"""LAUNCH_MODE="development"\nSECRET_KEY="{secret}"\nPG_USER="postgres"\nPG_PASSWORD="postgres"
PG_HOST="postgres"\nPG_PORT="5432"\nPG_DB="postgres"
PG_OPTS="connect_timeout=10"\nREDIS_HOST="redis"\nREDIS_PORT="6379"
RSA_PUBLIC_KEY="{public_key}"\nRSA_PRIVATE_KEY="{private_key}"\nHASH_ALGORITHM="argon2"\nTOKEN_ISS="https://anishsinha.io"
TOKEN_AUD="https://anishsinha.io"
"""

with open(env_file_path, "w+") as f:
    print("HERE")
    f.write(env)
