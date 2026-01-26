import express from 'express'
import { getUserProfile, loginUser, logoutUser, registerUser } from '../controllers/AuthController.js'
import { protect } from '../middleware/authMiddleware.js'
const router = express.Router()

router.post("/register", registerUser)
router.post("/login", loginUser)
router.post("/logout", protect, logoutUser)
router.get("/profile", protect, getUserProfile)
export default router