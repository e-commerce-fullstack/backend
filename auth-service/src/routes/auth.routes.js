import { Router } from "express";
import { registerUser, loginUser, logoutUser, getMe, refreshToken, getAllUser } from "../controllers/auth.controller.js";
import { adminRoute} from "../middlewares/validate.middleware.js"
import { authMiddleware } from "../middlewares/auth.middleware.js"; 

const router = Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/refresh", refreshToken);
router.post("/logout", logoutUser);
router.get("/users/all", adminRoute("admin"), getAllUser);

// 2. Add authMiddleware here. 
router.get("/me", authMiddleware, getMe); 

export default router;