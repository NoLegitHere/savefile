# Sử dụng image Node.js chính thức
FROM node:18

# Thiết lập thư mục làm việc trong container
WORKDIR /app

# Sao chép package.json và package-lock.json
COPY package*.json ./

# Cài đặt dependencies
RUN npm install

# Sao chép toàn bộ mã nguồn vào container
COPY . .

# Build ứng dụng React
RUN npm run build

# Sử dụng image Nginx để phục vụ ứng dụng React
FROM nginx:alpine
COPY --from=0 /app/build /usr/share/nginx/html

# Mở port frontend (3000)
EXPOSE 80

# Lệnh chạy Nginx
CMD ["nginx", "-g", "daemon off;"]
