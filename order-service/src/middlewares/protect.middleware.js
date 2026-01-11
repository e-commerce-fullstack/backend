import jwt from "jsonwebtoken";

export const protect = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res
      .status(401)
      .json({ success: false, message: "No token provided from API Gateway" });
  }

  const token = authHeader.split(" ")[1];
  if (!token) {
    return res
      .status(401)
      .json({ success: false, message: "Token missing from Authorization header" });
  }

  try {
    // Verify token using your JWT secret
    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
    req.user = decoded; // ✅ this makes req.user available in controllers
    next();
  } catch (err) {
    console.error("JWT verification error:", err.message);

    // Differentiate error types
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({ success: false, message: "Token expired" });
    }
    if (err.name === "JsonWebTokenError") {
      return res.status(401).json({ success: false, message: "Invalid token" });
    }

    // Fallback
    return res.status(401).json({ success: false, message: "User not authenticated" });
  }
};
