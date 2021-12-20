FROM node:17-slim AS builder

WORKDIR /web

COPY package.json .
COPY yarn.lock .

RUN yarn install \
    && yarn build


FROM node:17-slim

WORKDIR /web

COPY --from=builder /web/node_modules .
COPY --from=builder /web/package.json .
COPY --from=builder /web/yarn.lock .
COPY --from=builder /web/dist .

CMD ["yarn", "start:prod"]