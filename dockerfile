FROM node:18.14.0-alpine

WORKDIR /usr/src/frontend
COPY package*.json ./
RUN npm install
COPY . .

EXPOSE 3000/tcp
CMD ["npm", "start"]

# Run the following command to see the image:
# docker build -t lims-back-end ./
# docker run -p 3000:3000 -d lims-front-end

#docker ps
