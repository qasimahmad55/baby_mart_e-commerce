import express from 'express'
import { protect } from '../middleware/authMiddleware.js'
import { addToWishlist, clearWishlist, getUserWishList, getWishlistProducts, removeFromWishlist } from '../controllers/wishlistController.js'

const router = express.Router()


router.route("/")
    .get(protect, getUserWishList)

router.route("/add")
    .post(protect, addToWishlist)

router.route("/remove")
    .delete(protect, removeFromWishlist)

router.route("/products")
    .post(protect, getWishlistProducts)

router.route("/clear")
    .delete(protect, clearWishlist)
export default router