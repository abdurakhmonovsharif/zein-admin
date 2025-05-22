FROM node:20

# 1. Ishchi katalog
WORKDIR /usr/src/app

# 2. package.json va lock faylni copy
COPY package*.json ./
COPY package-lock.json ./
# 3. Paketlarni o‘rnatish
RUN npm install --production --save --force

# 4. Qolgan kodlarni copy qilish
COPY . .

# 5. Production build
RUN npm run build

# 6. Port ochish
EXPOSE 3000

# 7. Appni start qilish
CMD ["npm", "start"]
