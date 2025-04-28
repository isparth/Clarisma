# Build stage
FROM node:20-alpine AS build
WORKDIR /app
COPY . .
RUN npm install && npm run build

# Serve stage
FROM nginx:alpine
# Copy the built files
COPY --from=build /app/dist /usr/share/nginx/html
# Copy your custom nginx configuration (make sure nginx.conf exists in the frontend folder)
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]