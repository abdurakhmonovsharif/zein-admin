# 1. Rasmni aniqlash
FROM node:20

# 2. Ishchi katalog
WORKDIR /usr/src/app

# 3. package.json va lock faylni copy qilish
COPY package.json package-lock.json ./

# 4. Production muhitni o‘rnatish
ENV NODE_ENV=production

# 5. Paketlarni o‘rnatish (xato tuzatildi)
RUN npm install --production --force

# 6. Qolgan fayllarni (shu jumladan tsconfig, next.config.js, src) copy qilish
COPY . .

# 7. Production build
RUN npm run build

# 8. Portni ochish
EXPOSE 4000

# 9. Appni ishga tushurish
CMD ["npm", "start"]
