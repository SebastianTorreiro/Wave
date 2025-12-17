#Development
FROM node:19-alpine as development

WORKDIR /usr/src/app

COPY --chown=node:node package*.json ./

RUN npm ci

COPY --chown=node:node . .

USER node

#Build
FROM node:19-alpine as build

WORKDIR /usr/src/app

COPY --chown=node:node package*.json ./

RUN npm install
# COPY --chown=node:node --from=development /usr/src/app/node_modules ./node_modules

COPY --chown=node:node . .

ENV NODE_ENV production

RUN npm run build

USER node

#Production
FROM node:19-alpine as production

WORKDIR /usr/src/app

COPY --chown=node:node --from=build /usr/src/app/node_modules ./node_modules
COPY --chown=node:node --from=build /usr/src/app/dist ./dist

CMD [ "node", "dist/apps/server/main.js" ]
