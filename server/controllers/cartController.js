import asyncHandler from 'express-async-handler'
import User from '../models/userModel.js'
import Product from '../models/productModel.js';
import { useReducer } from 'react';

const getCart = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id).populate({
        path: "cart.productId",
        model: "Product"
    })

    if (!user) {
        res.status(404);
        throw new Error("User not found");
    }

    const validCartItems = await user.cart.filter((item) => item.productId
    )

    res.json({
        success: true,
        cart: validCartItems,
        message: "Cart retrieved successfully"
    })

})
const addItemToCart = asyncHandler(async (req, res) => {
    const { productId, quantity = 1 } = req.body

    if (!productId) {
        res.status(400);
        throw new Error("Product ID is required");
    }

    if (quantity < 1) {
        res.status(400);
        throw new Error("Quantity must be at least 1");
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

    const existingItemIndex = user.cart.findIndex((item) => item.productId.toString() === productId)

    if (existingItemIndex > -1) {
        user.cart[existingItemIndex].quantity += parseInt(quantity)
    } else {
        user.cart.push({
            productId,
            quantity: parseInt(quantity)
        })
    }

    await user.save()

    await user.populate({
        path: "cart.productId",
        model: "Product",
    })

    const validCartItems = user.cart.filter((item) => item.productId);

    res.json({
        success: true,
        cart: validCartItems,
        message: "Item added to cart successfully",
    });
})
const clearCart = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id)
    if (!user) {
        res.status(404);
        throw new Error("User not found");
    }

    user.cart = []
    await user.save()

    res.json({
        success: true,
        cart: [],
        message: "Cart cleared successfully",
    });
})
const updateCartItem = asyncHandler(async (req, res) => {
    const { productId, quantity } = req.body;

    if (!productId) {
        res.status(400);
        throw new Error("Product ID is required");
    }

    if (quantity < 0) {
        res.status(400);
        throw new Error("Quantity cannot be negative");
    }

    const user = await User.findById(req.user._id);
    if (!user) {
        res.status(404);
        throw new Error("User not found");
    }

    const itemIndex = user.cart.findIndex((item) => item.productId.toString === productId)
    if (itemIndex > -1) {
        if (quantity === 0) {
            user.cart.splice(itemIndex, 1)
        } else {
            user.cart[itemIndex].quantity += parseInt(quantity)
        }
        await user.save()

        await user.populate({
            path: "cart.productId",
            model: "Product"
        })
        const validCartItems = user.cart.filter((item) => item.productId);

        res.json({
            success: true,
            cart: validCartItems,
            message: "Cart item updated successfully",
        });
    } else {
        res.status(404);
        throw new Error("Item not found in cart");
    }

})
const removeItemFromCart = asyncHandler(async (req, res) => {
    const productId = req.params.id
    if (!productId) {
        res.status(400);
        throw new Error("Product ID is required");
    }

    const user = await User.findById(req.user._id)
    if (!user) {
        res.status(404);
        throw new Error("User not found");
    }

    const itemIndex = user.cart.findIndex((item) => item.productId.toString() === productId)

    if (itemIndex > -1) {
        user.cart.splice(itemIndex, 1)
        await user.save()

        await user.populate({
            path: "cart.productId",
            model: "Product"
        })

        const validCartItems = user.cart.filter((item) => item.productId)

        res.json({
            success: true,
            cart: validCartItems,
            message: "Item removed from cart successfully",
        });
    } else {
        res.status(404);
        throw new Error("Item not found in cart");
    }
})

export { getCart, addItemToCart, clearCart, updateCartItem, removeItemFromCart }