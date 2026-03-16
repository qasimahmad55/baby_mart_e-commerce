import asyncHandler from 'express-async-handler'
import User from '../models/userModel.js'
import Product from '../models/productModel.js'
import Category from '../models/categoryModel.js'
import Brand from '../models/brandModel.js'
import Order from '../models/orderModel.js'

const getStats = asyncHandler(async (req, res) => {
    const usersCount = await User.countDocuments()
    const productsCount = await Product.countDocuments()
    const categoriesCount = await Category.countDocuments()
    const brandsCount = await Brand.countDocuments()
    const ordersCount = await Order.countDocuments()

    //get total revenue (completed orders)

    const revenueData = await Order.aggregate([
        {
            $match: { status: { $in: ['paid', 'completed', 'delivered'] } }
        },
        {
            $group: { _id: null, totalRevenue: { $sum: "$total" } }
        }
    ])
    const totalRevenue = revenueData[0]?.totalRevenue || 0

    //get user role distribution
    const roles = await User.aggregate([
        {
            $group: {
                _id: "$role",
                count: { $sum: 1 }
            }
        }
    ])
    //get category distribution
    const categoriesData = await Product.aggregate([
        {
            $lookup:
            {
                from: "categories",
                localField: "category",
                foreignField: "_id",
                as: "categoryInfo"
            },

        },
        { $unwind: "$categoryInfo" },
        {
            $group: {
                _id: "$categoryInfo.name",
                count: { $sum: 1 }
            }
        },
    ])
    //get brand distribution

    const brandData = await Product.aggregate([
        {
            $lookup: {
                from: "brands",
                localField: "brand",
                foreignField: "_id",
                as: "brandInfo"
            }
        },
        {
            $unwind: "$brandInfo"
        },
        {
            $group: {
                _id: "$brandInfo.name",
                count: { $sum: 1 }
            }
        }
    ])

    res.json({
        counts: {
            users: usersCount,
            products: productsCount,
            categories: categoriesCount,
            brands: brandsCount,
            orders: ordersCount,
            totalRevenue,
        },
        roles: roles.map((role) => ({
            name: role._id,
            value: role.count
        })),
        categories: categoriesData.map((category) => (
            {
                name: category._id,
                value: category.count
            }
        )),
        brands: brandData.map((brand) => ({
            name: brand._id,
            value: brand.count
        }))
    })
})

export { getStats }