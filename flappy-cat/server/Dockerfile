FROM node:20 AS build
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
FROM node:20
WORKDIR /usr/src/app
COPY --from=build /usr/src/app/node_modules ./node_modules
COPY --from=build /usr/src/app/dist ./dist
COPY --from=build /usr/src/app/package*.json ./
COPY --from=build /usr/src/app/nest-cli.json ./
COPY --from=build /usr/src/app/tsconfig*.json ./
EXPOSE 3001
CMD ["node", "dist/main"]