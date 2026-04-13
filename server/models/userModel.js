import mongoose from "mongoose";
import bcrypt from 'bcryptjs'
const userSchema = new mongoose.Schema(
    {
        name:
        {
            type: String,
            required: true
        },
        email:
        {
            type: String,
            required: true,
            unique: true
        },
        password:
        {
            type: String,
            required: true
        },
        avatar:
        {
            type: String,
            default: 'https://res.cloudinary.com/daebrujay/image/upload/v1769169289/avatar-profile-icon-in-flat-style-male-user-profile-illustration-on-isolated-background-man-profile-sign-business-concept-vector_ezagop.jpg'
        },
        role:
        {
            type: String,
            enum: ['admin', 'user', 'deliveryman'],
            default: 'user'
        },
        addresses: [
            {
                street: {
                    type: String,
                    required: true,
                },

                city: {
                    type: String,
                    required: true,
                },

                country: {
                    type: String,
                    required: true,
                },

                postalCode: {
                    type: String,
                    required: true,
                },
                isDefault: {
                    type: Boolean,
                    default: false,
                },
            },
        ],
        wishList: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Product"
            }
        ],
        cart: [
            {
                productId: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "Product"
                },
                quantity: {
                    type: Number,
                    required: true,
                    min: 1,
                }
            }
        ]
    }, { timestamps: true }
)
//match entered password with hashed password
userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password)
}
//hashing password
userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
        next()
    }

    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt)

})
//one default address
userSchema.pre("save", async function (next) {
    if (this.isModified("addresses")) {
        const defaultAddress = this.addresses.find((addr) => addr.isDefault)
        if (defaultAddress) {
            this.addresses.forEach((addr) => {
                if (addr !== defaultAddress) addr.isDefault = false
            })
        }
    }
    next()
})

const User = mongoose.model('User', userSchema)
export default User 