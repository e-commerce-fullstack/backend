import jwt from "jsonwebtoken";
import { JWT_ACCESS_SECRET } from "../configs/env.js"; // Adjust path to your config

export const authMiddleware = (req, res, next) => {
  try {
    // 1. Get token from Headers (Format: Bearer <token>)
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ 
        message: "Access Denied: No token provided" 
      });
    }

    const token = authHeader.split(" ")[1];

    // 2. Verify Token
    jwt.verify(token, JWT_ACCESS_SECRET, (err, decoded) => {
      if (err) {
        return res.status(403).json({ 
          message: "Invalid or expired token" 
        });
      }

      // 3. Attach user data to the request object
      // This ensures req.user.id exists for your controller!
      req.user = decoded; 
      
      next(); // Move to the next function (the controller)
    });
  } catch (error) {
    console.error("Auth Middleware Error:", error.message);
    res.status(500).json({ message: "Internal Server Error in Middleware" });
  }
};