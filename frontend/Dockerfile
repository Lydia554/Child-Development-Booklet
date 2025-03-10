# 1. Koristi Node.js za build fazu
FROM node:18-alpine AS build

# 2. Postavi radni direktorijum
WORKDIR /app

# 3. Kopiraj package.json i package-lock.json i instaliraj zavisnosti
COPY package.json package-lock.json ./
RUN npm install

# 4. Kopiraj ceo projekat i napravi build
COPY . ./
RUN npm run build

# 5. Serviraj build fajlove sa Nginx-om
FROM nginx:alpine

# 6. Kopiraj build fajlove u Nginx root direktorijum
COPY --from=build /app/dist /usr/share/nginx/html

# 7. Kopiraj Nginx konfiguraciju
COPY nginx.conf /etc/nginx/conf.d/default.conf

# 8. Otvori port 80
EXPOSE 80

# 9. Pokreni Nginx
CMD ["nginx", "-g", "daemon off;"]
