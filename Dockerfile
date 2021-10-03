FROM node:14.18.0-alpine AS base

FROM base AS build
RUN mkdir -p /opt/build
WORKDIR /opt/build
COPY package*.json tsconfig.json ./
RUN npm install
COPY src src
RUN npm run build
RUN npm prune --production && rm -r /opt/build/src /opt/build/tsconfig.json

FROM base AS release
RUN mkdir -p /opt/service && \
    chown -R node: /opt/service
USER node
WORKDIR /opt/service
COPY --from=build --chown=node:node /opt/build /opt/service

CMD ["npm", "start"]
