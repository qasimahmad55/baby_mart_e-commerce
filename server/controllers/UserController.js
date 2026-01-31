import asyncHandler from 'express-async-handler'
import User from '../models/userModel.js'

const getUsers = asyncHandler(async (req, res) => {
    const users = await User.find({}).select('-password')
    res.status(200).json({
        success: true,
        users
    })
})
const createUser = asyncHandler(async (req, res) => {
    const { name, email, password, role, addresses } = req.body
    const userExists = await User.findOne({ email })
    if (userExists) {
        res.status(400)
        throw new Error("User already exists")
    }
    const user = await User.create(
        {
            name, email, password, role, addresses: addresses || []
        }
    )
    if (user) {
        //initialize empty cart
        // await Cart.create({ userId: user._id, item: [] })

        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            avatar: user.avatar,
            role: user.role,
            addresses: user.addresses,
        })

    } else {
        res.status(400)
        throw new Error("Invalid User")
    }
})
const getUserById = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id).select('-password')
    if (user) {
        res.json(user)
    } else {
        res.status(404)
        throw new Error("User not found")
    }
})
const updateUser = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id)
    if (!user) {
        res.status(404)
        throw new error("User not found")
    }
    //allow updates by user or admin
    // if (user._id.toString() !== req.user._id && req.user.role !== "admin") {

    // }

    user.name = req.body.name || user.name
    if (req.body.password) {
        user.password = req.body.password
    }
    if (req.body.role) {
        user.role = req.body.role
    }
    user.addresses = req.body.addresses || user.addresses
    //avatar
    const updatedUser = await user.save()

    res.status(200)
        .json(
            {
                _id: updatedUser._id,
                name: updatedUser.name,
                email: updatedUser.email,
                avatar: updatedUser.avatar,
                role: updatedUser.role,
                addresses: updatedUser.addresses,
            }
        )

})
const deleteUser = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id)
    if (user) {
        await user.deleteOne()
        res.status(200).json({
            success: true,
            message: "User deleted Successfully"
        })
    } else {
        res.status(400)
        throw new Error("User not found")
    }
})
const addAddress = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id)
    if (!user) {
        res.status(404)
        throw new Error("User not found")
    }
    //only allow user to modify their own addresses or admin
    if (user._id.toString() !== req.user._id.toString() && req.user.role !== "admin") {
        res.status(400)
        throw new Error("Not authorized to modify this user's addresses")
    }

    const { street, city, country, postalCode, isDefault } = req.body

    if (!street || !city || !country || !postalCode) {
        res.status(400)
        throw new Error("All addresses fields are required")
    }

    if (isDefault) {
        user.addresses.forEach((addr) => {
            addr.isDefault = false
        })
    }

    if (user.addresses.length === 0) {
        user.addresses.push({
            street, city, country, postalCode, isDefault: true
        })
    } else {
        user.addresses.push({
            street, city, country, postalCode, isDefault: isDefault || false
        })
    }

    await user.save()

    res.status(200)
        .json({
            success: true,
            addresses: user.addresses,
            message: "Addresses added successfully"
        })

})
const updateAddress = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id)
    if (!user) {
        res.status(404)
        throw new Error("User not found")
    }
    //only allow user to modify their own addresses or admin
    if (user._id.toString() !== req.user._id.toString() && req.user.role !== "admin") {
        res.status(400)
        throw new Error("Not authorized to modify this user's addresses")
    }
    const address = user.addresses.id(req.params.addressId)
    if (!address) {
        res.status(400)
        throw new Error("Address not found")
    }

    const { street, city, country, postalCode, isDefault } = req.body
    if (street) address.street = street
    if (city) address.city = city
    if (country) address.country = country
    if (postalCode) address.postalCode = postalCode

    if (isDefault) {
        user.addresses.forEach((addr) => {
            addr.isDefault = false
        })
        address.isDefault = true
    }

    await user.save()
    res.json({
        success: true,
        addresses: user.addresses,
        message: "Address updated successfully"
    })

})
const deleteAddress = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id)
    if (!user) {
        res.status(404)
        throw new Error("User not found")
    }
    //only allow user to modify their own addresses or admin
    if (user._id.toString() !== req.user._id.toString() && req.user.role !== "admin") {
        res.status(400)
        throw new Error("Not authorized to modify this user's addresses")
    }
    const address = user.addresses.id(req.params.addressId)
    if (!address) {
        res.status(400)
        throw new Error("Address not found")
    }
    //if deleting default address, make the first remaining address default
    const wasDefault = address.isDefault

    user.addresses.pull(req.params.addressId)

    if (wasDefault && user.addresses.length > 0) {
        user.addresses[0].isDefault = true
    }
    
    await user.save()

    res.json({
        success: true,
        addresses: user.addresses,
        message: "Address deleted successfully"
    })

})
export { getUsers, createUser, getUserById, updateUser, deleteUser, addAddress, updateAddress, deleteAddress }