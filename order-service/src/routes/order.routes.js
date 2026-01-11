import { Router } from 'express'
import { create, getAll, getById } from '../controllers/order.controller.js'
import { protect } from "../middlewares/protect.middleware.js";

const router = Router()

// All order routes should be protected
router.use(protect); 

router.post('/', create)
router.get('/', getAll)
router.get("/:id", getById);

export default router;