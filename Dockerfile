FROM node:20.18.0
RUN mkdir -p /app/node_modules && chown -R node:node /app
WORKDIR /app
COPY . .
RUN npm install
USER node

EXPOSE 3000
ENTRYPOINT [ "sh","-c", "npm run build && npm start"]
