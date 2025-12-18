Dog Tilt - Next.js & Socket.IO Deployment Guide
This project consists of two parts: a Next.js Frontend (Monitor & Controller) and a Node.js Backend (Socket.IO server).

🛠 1. Backend Deployment (AWS EC2 / Linux Server)
The backend requires a persistent connection and cannot be run on serverless functions (like Vercel/Lambda).

Folder: Navigate to /server.

Setup: - Run npm install.

Ensure port 8080 is open in the AWS Security Group (Inbound Rules).

CORS Configuration:

In server/index.js, update the origin array to include your final frontend URL (e.g., https://your-app.vercel.app).

Run: Use a process manager like pm2 to keep it running:

Bash

pm2 start index.js --name "dog-socket-server"
🌐 2. Frontend Deployment (AWS Amplify / Vercel)
The frontend is a standard Next.js app.

Environment Variables:

You MUST set this variable in the AWS Amplify / Vercel dashboard: NEXT_PUBLIC_SOCKET_SERVER = http://your-ec2-ip-or-domain:8080

Note: If the frontend is HTTPS, the backend must also be HTTPS (using an SSL certificate), or the browser will block the connection.

Build:

Bash

npm run build
📱 Mobile Permissions (HTTPS Requirement)
iOS/Safari: The DeviceOrientationEvent permission request only works over HTTPS.

For local testing, use ngrok to provide an HTTPS tunnel to your local machine: ngrok http 3000.

💡 One last tip for your friend
If they are using AWS Amplify, remind them that they need to add the environment variable before they hit "Deploy," or the build won't "bake" the correct IP into the client-side code.
