FROM node:18.9.1
WORKDIR /app
COPY package.json .
RUN yarn
COPY . .
CMD ["yarn", "dev"]