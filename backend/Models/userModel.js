const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Please Enter your Name'],
            maxlength: [30, 'Name cannot exceed 30 characters'],
            minlength: [4, 'Name should have more than 4 Characters']
        },
        email: {
            type: String,
            required: [true, "Please Enter your Email"],
            unique: true,
            validate: [validator.isEmail, 'Please Enter Valid Email']
        },
        password: {
            type: String,
            required: [true, 'Please Enter your Password'],
            minlength: [8, "Password should have more than 8 Characters"],
            select: false
        },
        avatar: {
            public_id: {
                type: String,
                required: true
            },
            url: {
                type: String,
                required: true
            }
        },
        role: {
            type: String,
            default: 'user'
        },

        resetPasswordToken: String,
        resetPasswordExpire: Date
    },
    {
        timestamps: true
    }
)

// -------------------------------------------------FOR PASSWORD ENCRYPT--------------------------------------------
userSchema.pre('save', async function (next) {

    if (!this.isModified('password')) {
        next();
    }

    this.password = await bcrypt.hash(this.password, 10);
})

// ---------------------------------------------------JWT TOKEN------------------------------------------------
userSchema.methods.getJWTToken = function () {

    return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE
    });
};

// ------------------------------------------ PASSWORD DECRYPTION FOR LOGIN -----------------------------------
userSchema.methods.comparePassword = async function (password) {
    return await bcrypt.compare(password, this.password);
}

// -----------------------------------------------RESET PASSWORD-------------------------------------------------
userSchema.methods.getResetPasswordToken = function () {

    // generating reset token
    const resetToken = crypto.randomBytes(20).toString('hex');

    // Hasing the token and storing into resetPasswordToken in userSchema
    this.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');

    this.resetPasswordExpire = Date.now() + 15 * 60 * 1000;

    return resetToken
}


const User = new mongoose.model('User', userSchema);

module.exports = User;