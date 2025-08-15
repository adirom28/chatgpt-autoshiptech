
FROM node:20
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm install || yarn install
COPY . .
CMD ["npm","start"]
