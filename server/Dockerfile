# Use a lightweight Node.js image
FROM node:18-slim

# Install Python, pip, and ffmpeg (required for yt-dlp media processing)
RUN apt-get update && apt-get install -y python3 python3-pip ffmpeg curl

# Install yt-dlp globally via pip
RUN pip3 install yt-dlp

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install Node dependencies
RUN npm install

# Copy the rest of the backend code
COPY . .

# Expose the port Render uses
EXPOSE 3001

# Start the server
CMD ["node", "index.js"]
