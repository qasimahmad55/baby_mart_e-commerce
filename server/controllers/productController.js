import asyncHandler from 'express-async-handler'
import cloudinary from '../config/cloudinary.js'
import Product from '../models/productModel.js';
const createProduct = asyncHandler(async (req, res) => {
    const {
        name,
        description,
        price,
        category,
        brand,
        image,
        discountPercentage,
        stock,
    } = req.body;

    const productExists = await Product.findOne({ name })
    if (productExists) {
        res.status(400)
        throw new Error("Product with this name already exists")
    }

    const product = await Product.create({
        name,
        description,
        price,
        category,
        brand,
        discountPercentage: discountPercentage || 0,
        stock: stock || 0,
        image: '',
    })

    if (product) {
        res.status(201).json(product);
    } else {
        res.status(400);
        throw new Error("Invalid product data");
    }

    
})

export { createProduct }