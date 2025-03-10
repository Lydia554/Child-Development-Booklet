# 1. Koristi Node.js kompatibilan sa Raspberry Pi
FROM node:18-alpine

# 2. Postavi radni direktorijum
WORKDIR /app

# 3. Kopiraj package.json i package-lock.json i instaliraj zavisnosti
COPY package.json package-lock.json ./
RUN npm install

# 4. Kopiraj ceo kod aplikacije
COPY . ./

# 5. Otvori port 5000 za API
EXPOSE 5000

# 6. Pokreni backend server
CMD ["node", "server.js"]
