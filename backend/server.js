import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import LoginRoute from './routes/LoginRoute.js';
import HomeRoute from './Routes/HomeRoute.js';
import cookieParser from "cookie-parser"; 
dotenv.config();


const app = express()
app.use(cookieParser());
app.use(cors({
  origin: process.env.APPLICATION_URL, // must match your frontend
  credentials: true,               // allow cookies
}));

app.use(express.json())

const PORT = process.env.PORT || 3000

const connectDb = async()=>{
    try{
        await mongoose.connect(process.env.MONGO_URI,{
            useNewUrlParser:true,
            useUnifiedTopology:true
        })
        console.log('MongoDB connected')
    }catch(error){
        console.log(error)
        console.log('MongoDB connection failed')
        process.exit(1)
    }
}


app.use('/auth',LoginRoute)
app.use('/home',HomeRoute)







const startServer = async()=>{
    await connectDb()
    app.listen(PORT,()=>{
        console.log(`Server is running on port ${PORT}`)
    })
}
startServer()