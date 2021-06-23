FROM node:14

WORKDIR app
COPY package.json ./
COPY ./ ./
RUN npm install
RUN npm run build
EXPOSE 8000
ENTRYPOINT ["npm", "run", "serve"]