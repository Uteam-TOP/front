# FROM node:20.12-alpine3.18 as build

# WORKDIR /app

# COPY package.json package-lock.json ./

# RUN npm install

# COPY . .

# RUN npx ng build --configuration production

# FROM nginx:1.25.3-alpine

# ARG VERSION_NUMBER_ARG=no-version
# ENV TZ=Europe/Zurich
# ENV VERSION_NUMBER=$VERSION_NUMBER_ARG

# COPY nginx/nginx.conf /etc/nginx/nginx.conf

# RUN touch /var/run/nginx.pid && \
#   mkdir -p /var/cache/nginx && \
#   chown -R nginx:nginx /var/run/nginx.pid && \
#   chown -R nginx:nginx /var/log/nginx && \
#   chown -R nginx:nginx /etc/nginx/nginx.conf && \
#   chown -R nginx:nginx /var/cache/nginx

# USER nginx

# COPY --from=build /app/dist/ucomand/browser/* /usr/share/nginx/html/
# COPY --from=build /app/src/assets /usr/share/nginx/html/assets

# EXPOSE 9001

# CMD ["nginx", "-g", "daemon off;"]





# Используем Node.js в качестве базового образа
FROM node:24-alpine AS build

# Устанавливаем рабочую директорию внутри контейнера
WORKDIR /app

# Копируем файлы package.json и package-lock.json в рабочую директорию
COPY package.json package-lock.json ./

# Устанавливаем зависимости
RUN npm install

# Копируем остальные файлы проекта в контейнер
COPY . .

RUN npm run build

# Устанавливаем переменные окружения
ARG VERSION_NUMBER_ARG=no-version
ENV VERSION_NUMBER=$VERSION_NUMBER_ARG
ENV TZ=Europe/Zurich

FROM nginx:alpine

COPY nginx/nginx.conf /etc/nginx/nginx.conf

# RUN touch /var/run/nginx.pid && \
#  mkdir -p /var/cache/nginx && \
#  chown -R nginx:nginx /var/run/nginx.pid && \
#  chown -R nginx:nginx /var/log/nginx && \
#  chown -R nginx:nginx /etc/nginx/nginx.conf && \
#  chown -R nginx:nginx /var/cache/nginx

# USER nginx

COPY --from=build /app/dist/ucomand/browser/* /usr/share/nginx/html/
COPY --from=build /app/src/assets /usr/share/nginx/html/assets

# Открываем порт 9001 для доступа к приложению
EXPOSE 9001

# Команда для запуска nginx
CMD ["nginx", "-g", "daemon off;"]
