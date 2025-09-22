import epxress from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import dotevn from 'dotenv';
dotevn.config();
import path from 'path'
import mongoose from 'mongoose';
import User from '../Models/User.js';

const router = epxress.Router();

router.post("/register", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }


    const hashedPassword = await bcrypt.hash(password, 10);

    await User.create({ email, password: hashedPassword });

    return res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    console.error(" Registration error:", err.message);
    return res.status(500).json({ message: "Server error. Please try again later." });
  }
});

router.post("/logout", (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // true in production (https)
      sameSite: "none", // must be 'none' for cross-site cookies
      path: "/" // important to specify the path
    });

    return res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
});





router.post('/login',async(req,res)=>{
    const{email,password} = req.body
    if(!email || !password){
        return res.status(400).json({message:"Username and password are required"})
    }
    const user = await User.findOne({email})
    if(!user){
        return res.status(400).json({message:"Invalid credentials"})
    }

    const isMatch = await bcrypt.compare(password,user.password)
    if(!isMatch){
        return res.status(400).json({message:"Invalid credentials"})
    }
    const token = jwt.sign({id:user._id,email:user.email},process.env.SECRET_KEY,{expiresIn:'1h'})
  res.cookie('token', token, {
  httpOnly: true,
  secure: true,        // must be true for HTTPS on Vercel
  sameSite: 'none',    // allows cross-origin cookie
  maxAge: 24 * 60 * 60 * 1000, // 1 day
  domain: ".vercel.app"
  });


  console.log("Token set in cookie:", token);

    return res.status(200).json({message:"Login successful",token}
    )
})

export default router;