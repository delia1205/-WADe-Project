FROM node:14
WORKDIR /app
COPY . /app
RUN npm install
RUN npm install google-translate-api-browser
RUN npm install i18next react-i18next
CMD ["npm", "start"]