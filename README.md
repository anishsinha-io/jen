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

Run the setup script which will generate a `.env.example` file which contains a randomly
generated secret key for Flask,
and an RSA key pair for signing JSON Web Tokens issued by the backend server.

If the above script ran correctly and generated the required file, run the command

`mv ./server/.env.example .env`

Once this is done, run

`docker compose up`

### Building Without Docker

Building this application without docker is _significantly_ harder, but here's how you can do it.

You will need the following software installed locally:

- PostgreSQL
- Redis
- Nginx
- Python
- Node.js

#### MacOS

_**PostgreSQL**_

To install PostgreSQL on Mac, ensure you have Homebrew installed. If you don't, please run the following command:

`/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"`

Install with: `brew install postgresql`

Verify it exists: `brew services list | grep postgresql`

Start it: `brew services start postgresql`

Verify it works: `psql postgresql://postgres@localhost/postgres`

By default, no password should be necessary.

_**Redis**_

Install with: `brew install redis`

Verify it exists: `brew services list | grep redis`

Start it: `brew services start redis`

Verify it works: `redis-cli`

_**NGINX**_

Install with: `brew install nginx`

Verify it exists: `brew services list | grep nginx`

Start it: `brew services start nginx`

Verify it works: `curl localhost` (you should receive a 404 status)

_**Python**_

Ensure you have Anaconda installed and the `conda` CLI configured: `conda --version`

Create an environment: `conda create -n <env_name> python=3.10.12 ipython`

Activate the environment: `conda activate <env_name>`

_**Node.js**_

Install the Node Version Manager: `curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.3/install.sh | bash`

Ensure nvm exists: `nvm --version`

Install the LTS version of Node: `nvm install --lts`

Activate the LTS version: `nvm use --lts`

_**PGAdmin**_

Install with: `brew install --cask pgadmin4`

Verify it exists by checking your applications folder. Double click to launch it.

#### Configuring the technology installed

_**PostgreSQL**_

Open PGAdmin. Right click on servers->register->server. Enter whatever you want in the name field. Click the connection
tab. Enter `localhost` for the host field. Enter `postgres` for the username and leave password blank. Click `save`. You
should be able to inspect the database now. Right click on blog->databases->postgres and select `query tool`. Copy the
contents of `migrations/1_initial.up.sql` and execute them against the database. This will create a schema called `blog`
and around 20 tables. To undo everything, simply drop the schema: `drop schema blog cascade`.

_**Redis**_

Redis requires no extra configuration.

_**NGINX**_

`cd $(brew --prefix)/etc/nginx`

`sudo vi nginx.conf`

Delete the contents of the file. (shortcut: `esc ggVGx`). Add the line `user <your_username> staff` at the top of the
file. Your username is the username you log into your computer with. If you don't know it, type `echo $HOME`. It's the
last path segment.

Copy and paste this beneath that line:

```nginx configuration
events {
    worker_connections 1024;
}

http {

    upstream backend {
        server localhost:8888;
    }

    upstream frontend {
        server localhost:5173;
    }

    server {
        listen 80;
        proxy_read_timeout 300;
        proxy_connect_timeout 300;
        proxy_send_timeout 300;
        fastcgi_read_timeout 300;

        location / {
            proxy_pass http://frontend/;
        }

        location /api {
            proxy_pass http://backend;
        }
    }
}
```

Save and quit (shortcut: `esc :wq`)

_**Python**_

Ensure the conda environment you created earlier is active. `cd` into the server directory of this repository.
Run `pip install -r requirements.txt`.

Run `python server/setup_dev_env.py`

Run `mv server/.env.example .env`

Run `python main.py` in the root of the server directory to start the development server.

_**Node.js**_

Install yarn: `brew install yarn`
Verify it installed: `yarn --version`

`cd` into the client directory. Run `yarn`. This will install all packages necessary for the frontend.

Start the client in development mode with `yarn dev`

_**One last task!**_

Run `sudo nginx -s reload` to reload the configuration we applied earlier.

Navigate to http://localhost to view the frontend.

To ensure the backend is healthy, run `curl http://localhost/api/health/live`.

### Viewing, Testing, and Developing

Whether you built from scratch or with docker, the following services will be generated:

- postgres (the database server that the core Python backend relies on for business logic. it is accessible on port 5432
  of localhost)
- redis (the caching layer that the core Python backend relies on for, among other things, persisting user sessions. it
  is accessible on port 6379 of localhost)
- pgadmin (a postgresql GUI tool which is helpful for running queries and inspecting the database. it is accessible on
  port 8889 of localhost)
- nginx (a web server which is absolutely required in order for session cookies to be set properly from the Python
  backend to the TypeScript client. it maps itself to port 80 on localhost)
- core (the core Python backend. it is accessible on localhost with routes prefixed with /api)
- client (the TypeScript UI. it is accessible on localhost)

once all service spin up, navigate to localhost (no port) to see the frontend. In order to log in, you need to create a
user. Run the following command in your terminal to generate one:

```curl
curl -XPOST -H "Content-type: application/json" -d '{
    "first_name": "Jenny",
    "last_name": "Sinha",
    "username": "jenny",
    "email": "jennysinha@gmail.com",
    "secret_data": "jenny"
}' 'http://localhost/api/users'
```

change the values to whatever you want.

You can run

```sql
select *
from blog.users
```

to see the user you just created, and

```sql
select *
from blog.user_credentials 
```

to see the hashed password and hashing algorithm (which by default is Argon2 but can be configured to use Bcrypt).

When you log in on the frontend, you can inspect the Application tab in the browser. Under "cookies", you will see a
cookie called `session_state`, which equals a value that is prefixed with `a+j`. This is the session_state cookie that
is used to determine your authentication status. The cookie is HttpOnly and inaccessible from client side JavaScript,
and immune to XSS attacks. Every 100 seconds (or on refresh), the frontend will POST the token endpoint ("
/api/auth/token") to retrieve a new short-lived access token which can be used to access API endpoints such as post
creation. This application has a rich role based access control system with extremely granular permissions. If you paste
your token into this [jwt decoder](https://jwt.io), you will be able to see the groups, roles, and permissions list of a
user.

### License

This code is licensed under the BSD 0 Clause License.