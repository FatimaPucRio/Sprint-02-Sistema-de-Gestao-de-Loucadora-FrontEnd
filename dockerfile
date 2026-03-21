# Usa o servidor Nginx, que é o padrão para páginas web
FROM nginx:alpine

# Copia todos os seus arquivos (index.html, style.css, script.js)
COPY . /usr/share/nginx/html

# O Nginx roda por padrão na porta 80
EXPOSE 80