import express from 'express'
import { admin, protect } from '../middleware/authMiddleware.js'
import { addAddress, createUser, deleteAddress, deleteUser, getUserById, getUsers, updateAddress, updateUser } from '../controllers/UserController.js'
const router = express.Router()

router
    .route("/")
    .get(protect, admin, getUsers)
    .post(protect, admin, createUser)

router
    .route("/:id")
    .get(protect, getUserById)
    .put(protect, updateUser)
    .delete(protect, admin, deleteUser)

router.route("/:id/addresses").post(protect, addAddress)
router.route("/:id/addresses/:addressId")
    .put(protect, updateAddress)
    .delete(protect, deleteAddress)

export default router
