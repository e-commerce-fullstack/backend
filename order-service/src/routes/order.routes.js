import { Router } from 'express'
import { create, getAll, getById, updateStatus } from '../controllers/order.controller.js' // Add updateStatus
import { protect } from "../middlewares/protect.middleware.js";

const router = Router()

/** * 1. WEBHOOK / INTERNAL ROUTE 
 * This must be ABOVE router.use(protect) so the 
 * Payment Service (Python) can call it.
 */
router.patch("/:id/confirm", updateStatus); 

// --- All routes below this line require a User Login token ---
router.use(protect); 

router.post('/', create)
router.get('/', getAll)
router.get("/:id", getById);

export default router;