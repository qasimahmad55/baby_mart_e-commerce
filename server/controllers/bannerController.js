import asyncHandler from 'express-async-handler'
import Banner from '../models/bannerModel.js'
import cloudinary from '../config/cloudinary.js'

const getBanners = asyncHandler(async (req, res) => {
    const banners = await Banner.find({})
    res.json(banners)
})
const createBanner = asyncHandler(async (req, res) => {
    const { name, title, startFrom, image, bannerType } = req.body
    const bannerExists = await Banner.findOne({ name })
    if (bannerExists) {
        res.status(400)
        throw new Error("Same banner already exist")
    }

    let imageUrl = ''
    if (image) {
        const result = await cloudinary.uploader.upload(image, {
            folder: "admin-dashboard/banners"
        })
        imageUrl = result.secure_url
    }
    const banner = await Banner.create({
        name, title, startFrom, image: imageUrl || undefined, bannerType
    })

    if (banner) {
        res.status(201)
            .json(banner)
    } else {
        res.status(400)
        throw new Error("Invalid banner data")
    }
})
const getBannerById = asyncHandler(async (req, res) => {
    const banner = await Banner.findById(req.params.id)
    if (banner) {
        res.json(banner)
    } else {
        res.status(404);
        throw new Error("Banner not found");
    }
})
const updateBanner = asyncHandler(async (req, res) => {
    const { name, title, startFrom, image, bannerType } = req.body
    const banner = await Banner.findById(req.params.id)

    if (banner) {
        banner.name = name || banner.name
        banner.title = title || banner.title
        banner.startFrom = startFrom || banner.startFrom
        banner.bannerType = bannerType || banner.bannerType

        try {
            if (image != undefined) {
                const result = await cloudinary.uploader.upload(image, {
                    folder: 'admin-dashboard/banners'
                })
                banner.image = result.secure_url
            } else {
                banner.image = undefined
            }

            const updatedBanner = await banner.save()
            res.json(updatedBanner)
        } catch (error) {
            if (error.name === 'ValdationError') {
                const errors = object.values(error.errors).map((err) => err.message)
                res.status(400)
                throw new Error(errors.join(", "))
            } else {
                res.status(400);
                throw new Error("Invalid banner data");
            }
        }
    } else {
        res.status(400)
        throw new Error("Banner not found")
    }
})
const deleteBanner = asyncHandler(async (req, res) => {
    const banner = await Banner.findById(req.params.id)
    if (banner) {
        await banner.deleteOne()
        res.json({ message: "Banner removed" })
    } else {
        res.status(404);
        throw new Error("Banner not found");
    }
})

export { getBanners, createBanner, getBannerById, updateBanner, deleteBanner }

