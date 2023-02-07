FROM node:19-bullseye-slim

ENV JWT_SECRET "secret"
ENV EXPIRESIN "60 days"
ENV DATABASE_URL "postgres://abc:abc@postgres:5432/testadvisor?schema=public"

WORKDIR /app

COPY package.json ./
COPY package-lock.json ./
RUN npm install

COPY . ./

RUN npx prisma generate
# RUN npx prisma migrate dev

EXPOSE 5000

CMD npx prisma migrate dev; npm start