import os

# access token lifetime is 120 seconds
ACCESS_TOKEN_LIFETIME = 120

# refresh token lifetime is 3 months
REFRESH_TOKEN_LIFETIME = 7889238

PUBLIC_KEY = os.environ["RSA_PUBLIC_KEY"]
PRIVATE_KEY = os.environ["RSA_PRIVATE_KEY"]

ISS = os.environ["TOKEN_ISS"]
AUD = os.environ["TOKEN_AUD"]
