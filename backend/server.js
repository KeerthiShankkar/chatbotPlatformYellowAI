import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import LoginRoute from './Routes/LoginRoute.js';
import HomeRoute from './Routes/HomeRoute.js';

dotenv.config();

const app = express();
app.use(cookieParser());
app.use(express.json());

// ------------------- CORS Setup -------------------
// Allowed frontend origin
const allowedOrigin = process.env.APPLICATION_URL;
console.log('Allowed frontend origin:', allowedOrigin);

// ✅ Use a single CORS middleware for all routes
app.use(cors({
  origin: allowedOrigin,           // allow your frontend
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // include OPTIONS for preflight
  credentials: true                // allow cookies
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
