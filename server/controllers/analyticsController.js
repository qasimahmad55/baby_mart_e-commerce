import asyncHandler from 'express-async-handler'
import Product from '../models/productModel.js'
import Order from '../models/orderModel.js'

const getAnalyticsOverview = asyncHandler(async (req, res) => {
    const totalProducts = await Product.countDocuments()
    const totalOrders = await Order.countDocuments()
    const totalUsers = await User.countDocuments()

    const revenueAggregation = await Order.aggregate([
        {
            $match: {
                status: { $in: ["paid", "completed"] }
            }
        },
        {
            $group: {
                _id: null, totalRevenue: { $sum: "$total" }
            }
        }
    ])

    const totalRevenue = revenueAggregation[0]?.totalRevenue || 0
})
const getProductAnalytics = asyncHandler(async (req, res) => {

})
const getSalesAnalytics = asyncHandler(async (req, res) => {

})
const getInventoryAlerts = asyncHandler(async (req, res) => {

})

export { getAnalyticsOverview, getProductAnalytics, getSalesAnalytics, getInventoryAlerts }