# 🚀 AI Project & Chat Platform (MERN + Auth with Cookies)

A **full-stack web application** that lets users **create projects** and **chat with AI models (like GPT)** in real-time.  
User authentication is secured with **JWT tokens stored in HTTP-only cookies**.  

Backend is built with **Express.js**, frontend with **React**, and the app can be deployed on **Vercel**.

---

## 📌 Features
- 🔐 User Authentication (Register, Login, Logout)
- 🍪 Secure HTTP-only cookies for storing JWT
- 🖥️ **Project Management**: Create, View, and Delete Projects
- 🤖 **AI Chat Interface**: Interact with AI models per project
- ⚡ Protected Routes via Middleware
- 🌍 CORS Configured for Frontend + Backend Communication

---

## 🛠️ Tech Stack
### Backend
- Node.js + Express.js
- JWT (jsonwebtoken) for auth
- MongoDB via Mongoose
- dotenv, CORS

### Frontend
- React
- Axios for API calls
- React Router DOM

---

## 📂 Project Structure


## 📂 Project Structure
project-root/
├── backend/
│   ├── server.js        # Main Express server
│   ├── Routes/          # Express routes
│   ├── Models/          # Database models (User, Project, etc.)
│   ├── Middlewares/     # Auth middleware
│   └── .env             # Environment variables
│
├── frontend/
│   ├── src/
│   │   ├── pages/       
│   │   └── main.jsx
|   |   └── index.html
│   └── package.json
│
└── README.md

---


---

## ⚙️ Setup Instructions

### 1. Clone the repository
git clone https://github.com/your-username/your-repo.git
cd your-repo

### 2. Backend Setup
cd backend
npm install

# Create a .env file inside backend/
PORT=5000
MONGO_URI=your_mongodb_connection_string
ECRET_KEY=your_secret_key
GEMINI_KEY= YOUR_KEY
APPLICATION_URL=YOUR_FRONTEND_LOCALHOST/DEPLOYED_URL

# Create a .env file inside frontend/

VITE_BACKEND_ADDRESS = YOUR_BACKEND_LOCALHOST/DEPLOYED_URL

# Run backend
npm start

### 3. Frontend Setup
cd frontend
npm install
npm start

---

## 🔑 Authentication & Project Flow
1. User registers or logs in → Backend generates JWT.
2. JWT is sent in a **secure HTTP-only cookie**.
3. Auth middleware validates token on protected routes.
4. Users can **create projects**, **chat with AI** inside each project, and **delete projects**.
5. Logout clears the cookie and revokes access.

---

## 🚀 API Endpoints

### Auth Routes
- `POST /register` → Create new user  
- `POST /login` → Login + set JWT cookie  
- `POST /logout` → Clear JWT cookie  

### Project Routes
- `POST /projects` → Create new project  
- `GET /projects` → Get all user projects  
- `DELETE /projects/:id` → Delete a project  

### Chat Routes
- `POST /projects/:id/chat` → Send a message to AI model  
- `GET /projects/:id/chat` → Fetch chat history  

---

## ✅ To-Do / Improvements
- [ ] Add refresh tokens for long sessions  
- [ ] Add rate limiting to prevent abuse  
- [ ] Support multiple AI models  
- [ ] Add offline access / caching  
- [ ] Add JWT-in-header fallback for mobile Safari  

---

