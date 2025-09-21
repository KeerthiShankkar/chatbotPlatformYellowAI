import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const AuthMiddleware = (req, res, next) => {
  // Log all cookies first
  console.log("Cookies received:", req.cookies);

  // Then extract token
  const token = req.cookies?.token;
  console.log("Token from cookie:", token);

  if (!token) {
    return res.status(401).json({ message: "No token, authorization denied" });
  }

  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Token is not valid" });
  }
};

export default AuthMiddleware;
