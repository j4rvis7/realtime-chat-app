# 💬 ChatterBox — Full-Stack Real-Time Chat Application

![Tech Stack](https://img.shields.io/badge/Stack-MERN-10b981?style=for-the-badge&logo=mongodb&logoColor=white) ![Real-Time](https://img.shields.io/badge/Real--Time-Socket.IO-000000?style=for-the-badge&logo=socketdotio&logoColor=white) ![Frontend](https://img.shields.io/badge/Frontend-React%20%2B%20Vite-61dafb?style=for-the-badge&logo=react&logoColor=black) ![Backend](https://img.shields.io/badge/Backend-Node%20%2B%20Express-339933?style=for-the-badge&logo=node.js&logoColor=white)

A production-grade, full-stack messaging platform built with the **MERN Stack** and **Socket.IO**. Designed for instant, seamless communication, this application features session-based authentication, live online presence tracking, real-time typing indicators, persistent message history, and cloud image uploads.

---

## 🚀 Live Demo

Experience the live application here:
* **🌐 Frontend (Vercel):** [https://realtime-chat-app-rho-one.vercel.app/](https://realtime-chat-app-rho-one.vercel.app/)
* **⚡ Backend API (Render):** [https://realtime-chat-backend-h8jk.onrender.com](https://realtime-chat-backend-h8jk.onrender.com)

---

## ✨ Key Features

| Feature | Description |
| :--- | :--- |
| **🔐 Secure Authentication** | Robust user registration, login, and session management using **Passport.js**, **passport-local-mongoose**, and **express-session** with cross-origin cookie security. |
| **💬 Real-Time Messaging** | Bidirectional, low-latency WebSocket communication powered by **Socket.IO** with automatic long-polling fallback. |
| **🟢 Live Online Presence** | Real-time user tracking that dynamically updates visual online/offline indicators across all connected clients. |
| **⌨️ Typing Indicators** | Live "is typing..." indicators broadcasted instantly to conversation participants. |
| **📜 Persistent Chat History** | Complete chat logs and conversation threads stored securely and efficiently in **MongoDB Atlas**. |
| **🖼️ Cloud Avatar Uploads** | Profile picture customization handled via multipart form data using **Multer** and stored on **Cloudinary**. |
| **🔍 Dynamic User Search** | Fast, indexed user discovery by username, full name, or email address to initiate new conversations. |
| **📱 Responsive UI/UX** | Clean, modern interface built with CSS variables and glassmorphism, optimized for desktop, tablet, and mobile devices. |

---

## 🏗️ System Architecture & Monorepo Structure

The project is organized as a clean monorepo separating client and server responsibilities while maintaining a single unified codebase:

```text
realtime-chat-app/
├── client/                    # React + Vite Single Page Application (SPA)
│   ├── src/
│   │   ├── api/               # Centralized Axios HTTP client & interceptors
│   │   ├── components/        # Reusable UI components (ChatWindow, ChatList, Avatar, etc.)
│   │   ├── context/           # Global React Contexts (AuthContext, SocketContext, ChatContext)
│   │   ├── pages/             # Route views (Home, Chat, Login, Register, Profile)
│   │   ├── App.jsx            # Application routing and layout wrapper
│   │   └── main.jsx           # Vite React DOM entry point
│   └── vite.config.js         # Vite configuration & development proxy settings
│
└── server/                    # Node.js + Express + Socket.IO Backend Server
    ├── config/                # Database, Passport.js, and Cloudinary configurations
    ├── controllers/           # Route logic (Auth, Users, Conversations, Messages)
    ├── middleware/            # Authentication guards & centralized error handling
    ├── models/                # Mongoose database schemas (User, Conversation, Message)
    ├── routes/                # Express REST API route definitions
    ├── socket/                # Socket.IO WebSocket server initialization & event listeners
    └── server.js              # HTTP server entry point wrapping Express and Socket.IO
