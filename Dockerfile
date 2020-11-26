FROM node
RUN mkdir -p guiaperguntas/node_modules && chown -R node:node guiaperguntas
WORKDIR guiaperguntas
# Install app dependencies
COPY package*.json ./
USER node
COPY --chown=node:node . .
RUN npm install
EXPOSE 8081
CMD [ "node", "app.js" ]