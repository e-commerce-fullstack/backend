import {
  createUser,
  findUserByEmail,
  getUser,
  findUserById,
  getAllUserRepo
} from "../database/repositories/user.repository.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { generateAccessToken, generateRefreshToken } from "../utils/token.js";

/**
 * Register a new user
 */
export const register = async (data) => {
  try {
    const user = await findUserByEmail(data.email);
    if (user) throw new Error("User already exists");
    if (!data.password) throw new Error("Password can't be empty");

    const hashedPassword = await bcrypt.hash(data.password, 10);
    const savedUser = await createUser({
      ...data,
      password: hashedPassword,
    });

    console.log("Saved user:", savedUser);
    return savedUser;
  } catch (err) {
    console.error("Register Error:", err.message);
    throw err; // propagate error to controller
  }
};

/**
 * Login user
 */
export const login = async (data) => {
  try {
    const user = await getUser(data.email);
    if (!user) throw new Error("Incorrect email or password");

    const isMatch = await bcrypt.compare(data.password, user.password);
    if (!isMatch) throw new Error("Incorrect email or password");

    // ADD ROLE HERE
    const payload = {
      id: user._id,
      email: user.email,
      role: user.role, // <--- Crucial for the frontend and middleware
    };

    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);

    return { user, accessToken, refreshToken };
  } catch (err) {
    console.error("Login Error:", err.message);
    throw err;
  }
};

/**
 * Refresh access token using a refresh token
 */
/**
 * Refresh access token using a refresh token
 */
export const refreshAccessToken = (token) => {
  try {
    if (!token) throw new Error("No refresh token provided");

    const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
    
    // Pass the decoded role back into the new access token
    return generateAccessToken({
      id: decoded.id,
      email: decoded.email,
      role: decoded.role // <--- Add this
    });
  } catch (err) {
    console.error("Refresh Token Error:", err.message);
    throw new Error("Invalid or expired refresh token");
  }
};


/**
 * Get user by ID
 */
export const getUserById = async (id) => {
  try {
    const user = await findUserById(id);
    if (!user) throw new Error("User not found");
    return user;
  } catch (err) {
    console.error("GetUserById Error:", err.message);
    throw err;
  }
};


/**
 * fetch all users display in admin dahsboard
 */
export const fetchAllUsers = async () => {
  try {
    // Find all users, exclude passwords, and sort by newest first
    const users = await getAllUserRepo()
    return users;
  } catch (err) {
    console.error("User Service Error (fetchAllUsers):", err.message);
    throw new Error("Could not retrieve users from database");
  }

};