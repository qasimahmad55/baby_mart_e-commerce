import asynchandler from 'express-async-handler'
import Brand from '../models/brandModel.js'
import cloudinary from '../config/cloudinary.js'

const getBrands = asynchandler(async (req, res) => {
    const brands = await Brand.find({})
    res.json(brands)
})
const createBrand = asynchandler(async (req, res) => {
    const { name, image } = req.body

    const brandExists = await Brand.findOne({ name })
    if (brandExists) {
        res.status(400);
        throw new Error("Brand already exists");
    }

    let imageUrl = ""
    if (image) {
        const result = await cloudinary.uploader.upload(image, { folder: "admin-dashboard/brands" })
        imageUrl = result.secure_url
    }

    const brand = await Brand.create({
        name, imageUrl: imageUrl || undefined
    })

    if (brand) {
        res.status(201).json(brand);
    } else {
        res.status(400);
        throw new Error("Invalid brand data");
    }
})
const getBrandById = asynchandler(async (req, res) => {
    const brand = await Brand.findById(req.params.id)
    if (brand) {
        res.json(brand)
    }
    else {
        res.status(404);
        throw new Error("Brand not found");
    }
})
const updateBrand = asynchandler(async (req, res) => {
    const { name, image } = req.body
    const brand = await Brand.findOne({ name })

    if (brand) {
        brand.name = name || brand.name
        if (image != undefined) {
            const result = await cloudinary.uploader.upload(image, { folder: "admin-dashboard/brands" })
            imageUrl = result.secure_url
        } else {
            brand.image = undefined
        }

        const updatedBrand = await brand.save()
        res.json(updatedBrand)
    } else {
        res.status(404);
        throw new Error("Brand not found");
    }

})
const deleteBrand = asynchandler(async (req, res) => {
    const brand = await Brand.findById(req.params.id)
    if (brand) {
        await brand.delete()
        res.json({ message: "Brand removed" });
    } else {
        res.status(404);
        throw new Error("Brand not found");
    }
})

export { getBrandById, getBrands, createBrand, updateBrand, deleteBrand }