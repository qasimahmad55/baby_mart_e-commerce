import express from 'express'
import { protect } from '../middleware/authMiddleware.js'
import { addItemToCart, clearCart, getCart, removeItemFromCart, updateCartItem } from '../controllers/cartController.js'

const router = express.Router()

router.use(protect)

router.route("/")
    .get(getCart)
    .post(addItemToCart)
    .delete(clearCart)

router.route("/update")
    .put(updateCartItem)

router.route("/:productId")
    .delete(removeItemFromCart)
export default router