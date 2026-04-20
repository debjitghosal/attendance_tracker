# Stage 1: Build the React application
FROM node:20-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
# Vite builds the static files into a folder named "dist"
RUN npm run build

# Stage 2: Serve the application using Nginx
FROM nginx:alpine
# Copy the built files from the previous stage to Nginx's serving directory
COPY --from=build /app/dist /usr/share/nginx/html
# Expose port 80 for the web server
EXPOSE 80
# Start Nginx
CMD ["nginx", "-g", "daemon off;"]