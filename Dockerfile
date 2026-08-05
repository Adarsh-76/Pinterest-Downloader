# Use a lightweight Node.js image
FROM node:18-slim

# Install Python (required to run yt-dlp), ffmpeg, and curl
RUN apt-get update && apt-get install -y python3 ffmpeg curl

# Download yt-dlp binary directly to avoid PEP 668 pip restrictions
RUN curl -L https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp -o /usr/local/bin/yt-dlp
RUN chmod a+rx /usr/local/bin/yt-dlp

# Set the working directory inside the container
WORKDIR /app

# Copy package.json from the server folder
COPY server/package*.json ./

# Install Node dependencies
RUN npm install

# Copy the rest of the backend code from the server folder
COPY server/ ./

# Expose the port Render uses
EXPOSE 3001

# Start the server
CMD ["node", "index.js"]
