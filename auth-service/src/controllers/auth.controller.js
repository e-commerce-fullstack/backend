import { register, login, getUserById, refreshAccessToken, fetchAllUsers } from "../services/auth.service.js";

export const registerUser = async (req, res, next) => {
  try {
    const user = await register(req.body);
    res.json(user);
  } catch (err) {
    next(err);
  }
};


export const loginUser = async (req, res, next) => {
  try {
    // 1. Your service already returns { user, accessToken, refreshToken }
    const { user, accessToken, refreshToken } = await login(req.body);

    // 2. Send the user object (which now includes the 'role' from your schema)
    res.json({
      accessToken,
      refreshToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role // <--- CHECK THIS LINE
      }
    });
  } catch (err) {
    next(err);
  }
};


export const refreshToken = async (req, res, next) => {
  try {
    const { refreshToken } = req.body; // frontend must send this
    if (!refreshToken) {
      return res.status(401).json({ message: "Refresh token missing" });
    }

    // Generate a new access token
    const accessToken = refreshAccessToken(refreshToken);

    // Return the new access token to the frontend
    res.json({ accessToken });
  } catch (err) {
    console.error("Refresh Token Error:", err.message);
    res.status(401).json({ message: "Invalid or expired refresh token" });
  }
};

export const logoutUser = async (req, res, next)=>{
  try{
    res.json({message: "Logout success"})
  }
  catch(err){
    next(err)
  }
}

// NEW: /auth/me controller
// backend/controllers/auth.controller.js

export const getMe = async (req, res, next) => {
  try {
    // 1. Safety Check: If middleware failed to attach user, stop here.
    if (!req.user) {
      return res.status(401).json({ message: "User context not found in request" });
    }

    // 2. Try both .id and ._id (Common in different JWT setups)
    const userId = req.user.id || req.user._id;

    if (!userId) {
      return res.status(401).json({ message: "User ID missing from token" });
    }

    const user = await getUserById(userId);
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // return only safe fields
    const safeUser = {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role, 
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    };

    res.json({ user: safeUser });
  } catch (err) {
    console.error("Error in getMe:", err.message);
    next(err);
  }
};

// User data to display in admin panel
export const getAllUser = async (req, res, next)=>{
    try {
        const allUsers = await fetchAllUsers()
        res.status(200).json({allUsers})
    } catch (err) {
        console.log("Fetch all user faild", err.message);
        next(err)
    }

}