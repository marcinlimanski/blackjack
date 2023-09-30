# Fetching the latest node image on alpine linux
FROM node:alpine

# Setting up the work directory
WORKDIR /backend

# Installing dependencies
COPY package*.json /backend

RUN npm install

# Copying all the files in our project
COPY . .

# Expose the port the app runs on
EXPOSE 3001

# Starting our application
CMD npm start