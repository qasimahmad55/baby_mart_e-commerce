import express from 'express'
import { protect } from '../middleware/authMiddleware.js'
import { createOrderFromCart, deleteOrder, getAllOrdersAdmin, getOrderById, getOrders, updateOrderStatus } from '../controllers/ordersController.js'

const router = express.Router()

router.route("/admin")
    .get(protect, getAllOrdersAdmin)

router.route("/")
    .get(protect, getOrders)
    .post(protect, createOrderFromCart)

router.route("/:id")
    .get(protect, getOrderById)
    .delete(protect, deleteOrder)

router.route("/:id/status")
    .put(protect, updateOrderStatus)

router.route("/:id/webhook-status")
    .put(updateOrderStatus)
export default router