import asyncHandler from 'express-async-handler'
import Category from '../models/categoryModel.js'


const getCategories = asyncHandler(async (req, res) => {
    const page = parseInt(req.query.page) || 1
    const perPage = parseInt(req.query.perPage) || 20
    const sortOrder = req.query.sortOrder || "asc"

    if (page < 1 || perPage < 1) {
        res.status(400);
        throw new Error("Page and perPage must be positive integers");
    }

    if (!["asc", "dsc"].includes(sortOrder)) {
        res.status(400);
        throw new Error('Sort order must be "asc" or "desc"');
    }

    const skip = (page - 1) * perPage
    const total = await Category.countDocuments({})
    const sortValue = sortOrder === "asc" ? 1 : -1

    const categories = await Category.find({})
        .skip(skip)
        .limit(perPage)
        .sort({ createdAt: sortValue })

    const totalPages = Math.ceil(total / perPage)

    res.json({ categories, total, page, perPage, totalPages })
})
const getCategoryById = asyncHandler(async (req, res) => {

})
const createCategory = asyncHandler(async (req, res) => {

})
const updateCategory = asyncHandler(async (req, res) => {

})
const deleteCategory = asyncHandler(async (req, res) => {

})

export {
    getCategories, getCategoryById, createCategory, updateCategory, deleteCategory
}