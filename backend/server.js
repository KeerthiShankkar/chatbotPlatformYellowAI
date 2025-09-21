import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import LoginRoute from './routes/LoginRoute.js';
import HomeRoute from './Routes/HomeRoute.js';

dotenv.config();

const app = express();
app.use(cookieParser());
app.use(express.json());

// ------------------- CORS Setup -------------------
// Allowed frontend origin
const allowedOrigin = process.env.APPLICATION_URL; // e.g., https://chat-platform-yellow-ai.vercel.app

app.use(cors({
  origin: allowedOrigin,   // exact match required
  credentials: true        // allow cookies
}));

// Handle preflight requests for POST/PUT with credentials
app.options('*', cors({
  origin: allowedOrigin,
  credentials: true
}));

// ------------------- MongoDB Connection -------------------
const connectDb = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('MongoDB connected');
  } catch (error) {
    console.error('MongoDB connection failed:', error);
    process.exit(1);
  }
};

// ------------------- Routes -------------------
app.use('/auth', LoginRoute);
app.use('/home', HomeRoute);

// ------------------- Start Server -------------------
const PORT = process.env.PORT || 3000;
const startServer = async () => {
  await connectDb();
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};

startServer();
