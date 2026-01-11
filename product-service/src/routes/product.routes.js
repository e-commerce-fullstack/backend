import { Router } from "express";
import { create, getAll, getById, getCategories, deleted, updated } from "../controllers/product.controller.js";
// import { validateProduct } from "../../middlewares/validate.middleware.js";
import { upload } from "../middlewares/image.middleware.js";
// import { protectRoute } from "../../middlewares/protect.middleware.js";

const router = Router();

router.get("/categories", getCategories);

// POST routes
router.post(
  "/",
  // protectRoute(),
  upload.single("image"), // 2. MUST include this here!
  // validateProduct,
  create
);

// GET routes
router.get("/", getAll);
router.delete("/:id",  deleted)
router.put("/:id",upload.single("image"), updated)
router.get("/:id", getById);

export default router;