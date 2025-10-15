From node

WORKDIR /app

copy package*.json ./

RUN npm install

RUN npm install react-router-dom

COPY . .

RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]