# 💬 Next-Nest Chatroom Application [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

[![Next.js](https://img.shields.io/badge/Next.js-14.2.3-000000?logo=next.js)](https://nextjs.org/)
[![NestJS](https://img.shields.io/badge/NestJS-10.0.0-E0234E?logo=nestjs)](https://nestjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-7.0-47A248?logo=mongodb)](https://www.mongodb.com/)

A full-stack real-time chat application built with **Next.js**, **NestJS**, and **MongoDB Atlas**.

👉 **Live Demo**: [Coming Soon]  
📂 **GitHub Repository**: [https://github.com/N1wan7ha/Ne-s-x-t-ChatRoom-App](https://github.com/N1wan7ha/Ne-s-x-t-ChatRoom-App)



## ✨ Features

- 🔐 **Secure Authentication**
  - JWT-based registration/login
  - Password hashing with bcrypt
  - Protected routes & API endpoints
- 💬 **Real-time Communication**
  - WebSocket integration (Socket.IO)
  - Message history persistence
  - Timestamped messages
- 🚀 **Modern Tech Stack**
  - Next.js 14 App Router
  - NestJS REST API
  - MongoDB Atlas Cloud Database
- 🎨 **Responsive UI**
  - TailwindCSS styling
  - Loading states & error handling
  - Clean chat interface

## 🚀 Getting Started

### Prerequisites
- Node.js v18+
- MongoDB Atlas account
- Git

### Installation

```bash
# Clone repository
git clone https://github.com/N1wan7ha/Ne-s-x-t-ChatRoom-App.git
cd Ne-s-x-t-ChatRoom-App

Backend Setup (NestJS)

cd backend
npm install

# Create environment file
cp .env.example .env
nano .env  # Add your credentials

# Start development server
npm run start:dev

Frontend Setup (Next.js)

cd ../frontend
npm install
npm run dev
```


### 🔧 Environment Variables
- backend/.env

MONGODB_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/chatdb
JWT_SECRET=your_strong_secret_here
PORT=3000


### 🌐 API Endpoints
- Method	Endpoint	Description	Auth Required
- POST	/auth/register	Register new user	No
- POST	/auth/login	User login	No
- GET	/messages	Get message history	Yes
- POST	/messages	Send new message	Yes


### 🔒 Security Implementation
- **JWT Authentication: HTTP-only cookies for token storage**
  - Password Hashing: bcrypt with salt rounds
  - CORS Policy: Restricted to frontend origin
  - Rate Limiting: Implemented on auth routes
  - Input Validation: Request payload sanitization

## 👨💻 Author & Support
N1wan7ha
GitHub

