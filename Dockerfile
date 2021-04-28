FROM node:latest

WORKDIR /home/battle-snake

COPY src /home/battle-snake/src/
COPY package.json /home/battle-snake/
COPY package-lock.json /home/battle-snake/
COPY bower.json /home/battle-snake/

RUN npm install

ENTRYPOINT npm run start
