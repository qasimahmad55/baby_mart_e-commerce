import asyncHandler from 'express-async-handler'
import User from '../models/userModel.js'
import generateToken from '../utils/generateToken.js'

const registerUser = asyncHandler(async (req, res) => {
    const { name, email, password, role } = req.body

    const userExist = await User.findOne({ email })
    if (userExist) {
        res.status(200)
        throw new Error('User already exist, Try Login')
    }

    const user = await User.create({
        name, email, password, role, addresses: []
    })
    if (user) {
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
        throw new Error("Invalid user data")
    }
})
const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body
    const user = await User.findOne({ email })
    if (user && (await user.matchPassword(password))) {
        res.status(200).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            avatar: user.avatar,
            role: user.role,
            addresses: user.addresses || [],
            token: generateToken(user._id)
        })
    } else {
        res.status(400)
        throw new Error("Invalid Email or Password")
    }
})
const getUserProfile = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id)
    if (user) {
        res.status(200).json(
            {
                _id: user._id,
                name: user.name,
                email: user.email,
                avatar: user.avatar,
                role: user.role,
                addresses: user.addresses || [],
            }
        )
    } else {
        console.error("Profile:User not found for Id", req.user?._id)
        res.status(400)
        throw new Error("User not found")
    }
})
const logoutUser = asyncHandler(async (req, res) => {
    res.status(200)
        .json(
            {
                success: true,
                message: "Logged Out Successfully"
            }
        )
})
export { registerUser, loginUser, getUserProfile, logoutUser }
