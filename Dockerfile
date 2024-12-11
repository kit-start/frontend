FROM node

WORKDIR /frontend

COPY package.json .
RUN npm i

COPY . ./

EXPOSE 3000

CMD ["npm", "run", "build"]

CMD ["npm", "run", "preview"]