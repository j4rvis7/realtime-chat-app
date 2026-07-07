# 💬 ChatterBox — Full Stack Real-Time Chat Application

A production-ready, full-stack real-time messaging platform built with the MERN stack and Socket.IO. Features session-based authentication, live messaging, online presence tracking, profile picture uploads, and persistent chat history.

![Tech Stack](https://img.shields.io/badge/Stack-MERN-green) ![Socket.IO](https://img.shields.io/badge/Real--Time-Socket.IO-black) ![Auth](https://img.shields.io/badge/Auth-Passport.js-blue)

---

## 🚀 Live Demo

- **Frontend**: `https://your-app.vercel.app` *(deploy to Vercel)*
- **Backend**: `https://your-api.render.com` *(deploy to Render)*

---

## ✨ Features

| Feature | Description |
|---|---|
| 🔐 Authentication | Register, login, logout with Passport.js + express-session |
| 💬 Real-Time Chat | Instant messaging via Socket.IO |
| 📜 Chat History | All messages persisted in MongoDB |
| 🟢 Online Status | Live user presence tracking |
| ⌨️ Typing Indicator | Real-time "is typing..." indicator |
| 👤 User Profiles | Edit name, email, bio, and profile picture |
| 🖼️ Avatar Upload | Profile pictures via Multer + Cloudinary |
| 🔍 User Search | Search users by name, username, or email |
| 📱 Responsive | Mobile, tablet, and desktop layouts |

---

## 🏗️ Project Structure

```
Real Time/
├── client/                    # React + Vite frontend
│   ├── src/
│   │   ├── api/               # Axios API modules
│   │   ├── components/        # Reusable UI components
│   │   │   ├── Avatar/
│   │   │   ├── ChatList/
│   │   │   ├── ChatWindow/
│   │   │   ├── LoadingSpinner/
│   │   │   ├── MessageBubble/
│   │   │   ├── Navbar/
│   │   │   ├── OnlineUsers/
│   │   │   └── ProtectedRoute/
│   │   ├── context/           # React Context providers
│   │   │   ├── AuthContext.jsx
│   │   │   ├── ChatContext.jsx
│   │   │   └── SocketContext.jsx
│   │   ├── pages/
│   │   │   ├── Home/
│   │   │   ├── Login/
│   │   │   ├── Register/
│   │   │   ├── Chat/
│   │   │   ├── Profile/
│   │   │   ├── EditProfile/
│   │   │   ├── Search/
│   │   │   └── NotFound/
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css          # Global design system CSS
│   ├── .env.example
│   ├── index.html
│   └── vite.config.js
│
└── server/                    # Node.js + Express backend
    ├── config/
    │   ├── db.js              # MongoDB connection
    │   ├── passport.js        # Passport.js setup
    │   └── cloudinary.js      # Cloudinary + Multer
    ├── controllers/
    │   ├── authController.js
    │   ├── userController.js
    │   ├── conversationController.js
    │   └── messageController.js
    ├── middleware/
    │   ├── auth.js            # isAuthenticated middleware
    │   └── errorHandler.js    # Centralized error handler
    ├── models/
    │   ├── User.js
    │   ├── Conversation.js
    │   └── Message.js
    ├── routes/
    │   ├── authRoutes.js
    │   ├── userRoutes.js
    │   ├── conversationRoutes.js
    │   └── messageRoutes.js
    ├── socket/
    │   └── socket.js          # Socket.IO event handlers
    ├── utils/
    │   ├── AppError.js
    │   └── asyncWrapper.js
    ├── validators/
    │   └── schemas.js         # Joi validation schemas
    ├── app.js                 # Express app setup
    ├── server.js              # HTTP + Socket.IO entry
    └── .env.example
```

---

## ⚙️ Environment Variables

### Backend (`server/.env`)

```env
MONGODB_URI=mongodb+srv://<user>:<pass>@cluster.mongodb.net/chatapp
SESSION_SECRET=your_super_secret_session_key
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
CLIENT_URL=http://localhost:5173
PORT=5000
NODE_ENV=development
```

### Frontend (`client/.env`)

```env
VITE_API_URL=http://localhost:5000
```

---

## 🛠️ Local Development Setup

### Prerequisites
- Node.js v18+
- MongoDB Atlas account (free tier works)
- Cloudinary account (free tier works)

### 1. Clone the repository
```bash
git clone https://github.com/yourusername/chatterbox.git
cd chatterbox
```

### 2. Set up the backend
```bash
cd server
cp .env.example .env
# Fill in your .env values
npm install
npm run dev
# Server runs at http://localhost:5000
```

### 3. Set up the frontend
```bash
cd client
cp .env.example .env
# Set VITE_API_URL=http://localhost:5000
npm install
npm run dev
# Client runs at http://localhost:5173
```

### 4. Open in browser
Navigate to **http://localhost:5173**

---

## 📡 API Documentation

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register a new user |
| POST | `/api/auth/login` | Login with credentials |
| POST | `/api/auth/logout` | Logout current session |
| GET | `/api/auth/me` | Get current user session |

### Users
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/users/search?q=query` | Search users |
| GET | `/api/users/online` | Get online users |
| GET | `/api/users/:id` | Get user by ID |
| PUT | `/api/users/profile` | Update profile |
| POST | `/api/users/avatar` | Upload avatar (multipart) |

### Conversations
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/conversations` | Get all conversations |
| POST | `/api/conversations` | Create/get conversation |
| GET | `/api/conversations/:id` | Get single conversation |

### Messages
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/messages/:conversationId` | Get message history |
| POST | `/api/messages/:conversationId` | Send message (REST) |

---

## 🔌 Socket.IO Events

### Client → Server
| Event | Payload | Description |
|-------|---------|-------------|
| `joinConversation` | `conversationId` | Join a chat room |
| `leaveConversation` | `conversationId` | Leave a chat room |
| `sendMessage` | `{ conversationId, content }` | Send a message |
| `typing` | `{ conversationId }` | Signal typing started |
| `stopTyping` | `{ conversationId }` | Signal typing stopped |

### Server → Client
| Event | Payload | Description |
|-------|---------|-------------|
| `newMessage` | `Message object` | New message in room |
| `onlineUsers` | `[userId, ...]` | Updated online user list |
| `userTyping` | `{ userId, conversationId }` | User is typing |
| `userStoppedTyping` | `{ userId, conversationId }` | User stopped typing |
| `conversationUpdated` | `{ conversationId, lastMessage }` | Notify sidebar update |

---

## 🗄️ Database Schema

### User
```js
{ username, email, fullName, bio, profilePicture: { url, publicId },
  isOnline, lastSeen, hash, salt, timestamps }
```

### Conversation
```js
{ participants: [ObjectId], lastMessage: ObjectId, lastMessageAt, timestamps }
```

### Message
```js
{ conversation: ObjectId, sender: ObjectId, content, readBy: [ObjectId],
  messageType: 'text'|'image', timestamps }
```

---

## 🚀 Deployment

### Frontend → Vercel
```bash
cd client
npm run build
# Push to GitHub, import repo to Vercel
# Set VITE_API_URL to your Render backend URL
```

### Backend → Render
1. Create a new Web Service on Render
2. Set build command: `npm install`
3. Set start command: `node server.js`
4. Add all environment variables from `server/.env.example`
5. Set `CLIENT_URL` to your Vercel frontend URL
6. Set `NODE_ENV=production`

---

## 🧰 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Vite, React Router v6 |
| Styling | Plain CSS, CSS Variables, Glassmorphism |
| State | Context API (Auth, Socket, Chat) |
| HTTP Client | Axios |
| Backend | Node.js, Express.js |
| Database | MongoDB, Mongoose |
| Authentication | Passport.js, passport-local-mongoose, express-session |
| Real-Time | Socket.IO |
| File Upload | Multer, Cloudinary |
| Validation | Joi |
| Session Store | connect-mongo |
| Dev Tools | Nodemon, Vite HMR |

---

## 📄 License

MIT © 2025 ChatterBox
