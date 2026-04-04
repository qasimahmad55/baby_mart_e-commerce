import asyncHandler from 'express-async-handler'
import User from '../models/userModel.js'
import Product from '../models/productModel.js';

const getUserWishList = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id).select("wishList")
    if (!user) {
        res.status(404);
        throw new Error("User not found");
    }
    res.json({
        success: true,
        wishlist: user.wishList || []
    })
})
const addToWishlist = asyncHandler(async (req, res) => {
    const { productId } = req.body
    if (!productId) {
        res.status(400);
        throw new Error("Product ID is required");
    }

    const product = await Product.findById(productId)
    if (!product) {
        res.status(404);
        throw new Error("Product not found");
    }

    const user = await User.findById(req.user._id)
    if (!user) {
        res.status(404);
        throw new Error("User not found");
    }

    if (user.wishList.includes(productId)) {
        res.status(400);
        throw new Error("Product already in wishlist");
    }

    user.wishList.push(productId)
    await user.save()

    res.json({
        success: true,
        wishlist: user.wishList,
        message: "Product added to wishlist"
    })
})
const removeFromWishlist = asyncHandler(async (req, res) => {
    const { productId } = req.body
    if (!productId) {
        res.status(400);
        throw new Error("Product ID is required");
    }

    const user = await User.findById(req.user._id)
    if (!user) {
        res.status(404);
        throw new Error("User not found");
    }

    user.wishList = user.wishList.filter((id) => id.toString() !== productId.toString())

    await user.save()
    res.json({
        success: true,
        wishlist: user.wishList,
        message: "Product removed from wishlist",
    });
})
const getWishlistProducts = asyncHandler(async (req, res) => {
    const { productIds } = req.body
    if (!productIds || !Array.isArray(productIds) || productIds.length === 0) {
        res.status(400);
        throw new Error("Product IDs array is required");
    }

    const products = await Product.find({
        _id: { $in: productIds },
    }).populate("category", "name")

    res.json({
        success: true,
        products,
    })
})
const clearWishlist = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id)
    if (!user) {
        res.status(404);
        throw new Error("User not found");
    }

    user.wishList = []

    await user.save()

    res.json({
        success: true,
        wishlist: [],
        message: "Wishlist cleared successfully",
    });
})

export { getUserWishList, addToWishlist, removeFromWishlist, getWishlistProducts, clearWishlist }