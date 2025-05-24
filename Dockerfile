FROM node:20

# 1. Ishchi katalog
WORKDIR /usr/src/app

# 2. package.json va lock faylni copy
COPY package*.json ./
COPY package-lock.json ./
# 3. Paketlarni o‘rnatish
RUN npm install --production --save --forc

# 4  ENV production
COPY . .

# 5. Qolgan kodlarni copy qilish
ENV NODE_ENV=production

# 6. Production build
RUN npm run build

# 7. Port ochish
EXPOSE 4000

# 8. Appni start qilish
CMD ["npm", "start"]
