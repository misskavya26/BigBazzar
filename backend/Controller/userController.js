const ErrorHandler = require('../utils/errorHandler');
const asyncHandler = require('../utils/asyncHandler');
const User = require('../Models/userModel');
const getToken = require('../utils/getToken');
const sendEmail = require('../utils/sendEmail');
const crypto = require('crypto');

// --------------------------------------------- REGISTER USER ---------------------------------------------
const registerUserController = asyncHandler(async (req, res, next) => {

    const { name, email, password } = req.body;

    const user = await User.create({
        name, email, password,
        avatar: {
            public_id: 'this is sample id',
            url: 'sampleidurl'
        }
    });

    getToken(user, 201, res);
});

// ---------------------------------------------------- LOGIN USER -----------------------------------------------
const loginUserController = asyncHandler(async (req, res, next) => {

    const { email, password } = req.body;

    if (!email || !password) {
        return next(new ErrorHandler('Please Enter email or password', 400));
    }

    const user = await User.findOne({ email }).select("+password");

    if (!user) {
        return next(new ErrorHandler('Invalid Email or Password', 401));
    }

    const isPasswordMatch = await user.comparePassword(password);

    if (!isPasswordMatch) {
        return next(new ErrorHandler('Invalid Email or Password', 401));
    }

    getToken(user, 200, res);

})

//------------------------------------------ LOGOUT USER -------------------------------------------
const logoutUserController = asyncHandler(async (req, res, next) => {

    res.cookie('token', null, {
        expires: new Date(Date.now()),
        httpOnly: true
    });

    res.status(200).json({
        success: true,
        message: 'Log out Successfully'
    });
})

// ------------------------------------------ FORGOT PASSWORD --------------------------------------------
const forgotPasswordController = asyncHandler(async (req, res, next) => {

    const user = await User.findOne({ email: req.body.email });

    if (!user) {
        return next(new ErrorHandler('User not Found', 404));
    }

    // getting reset token
    const resetToken = user.getResetPasswordToken();

    await user.save({ validateBeforeSave: false });

    const resetPasswordUrl = `${req.protocol}://${req.get('host')}/api/password/reset/${resetToken}`;

    const resetPasswordMessage = `Here is your Reset Password Token :- \n\n ${resetPasswordUrl} \n\n If you don't apply for this Email then kindly ignore this.`

    try {
        await sendEmail({
            email: user.email,
            subject: 'Ecommerce Password Recovery',
            resetPasswordMessage
        })

        res.status(200).json({
            success: true,
            message: `Email sent to ${user.email} Successfully`
        })

    } catch (error) {
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;

        await user.save({ validateBeforeSave: false });

        return next(new ErrorHandler(error.message, 500));

    }
})

// ----------------------------------------------- RESET PASSWORD ---------------------------------------------------
const resetPasswordController = asyncHandler(async (req, res, next) => {

    const resetPasswordToken = crypto.createHash('sha256').update(req.params.token).digest('hex');

    const user = await User.findOne({
        resetPasswordToken,
        resetPasswordExpire: { $gt: Date.now() }
    });

    if (!user) {
        return next(new ErrorHandler('Reset Password Token is Invalid or Expire', 400));
    }

    if (req.body.password !== req.body.confirmPassword) {
        return next(new ErrorHandler("Passwords doesn't match", 400));
    }

    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    getToken(user, 200, res);
})

//  --------------------------------------- GET USER DETAIL ---------------------------------------------------
const getUserDetailController = asyncHandler(async (req, res, next) => {

    const user = await User.findById(req.user.id);

    res.status(200).json({
        success: true,
        user
    });
});

// ---------------------------------- CHANE / UPDATE PASSWORD ------------------------------------------
const updatePasswordController = asyncHandler(async (req, res, next) => {

    const user = await User.findById(req.user.id).select("+password");

    const isPasswordMatch = await user.comparePassword(req.body.oldPassword);

    if (!isPasswordMatch) {
        return next(new ErrorHandler('Old Password is Incorrect', 400));
    }

    if (req.body.newPassword !== req.body.confirmPassword) {
        return next(new ErrorHandler('Passwords Does not match', 400));
    }

    user.password = req.body.newPassword;

    await user.save();

    getToken(user, 200, res);
})

// ---------------------------------------- USER PROFILE UPDATE ---------------------------------------
const userProfileUpdateController = asyncHandler(async (req, res, next) => {

    const updateUserData = {
        name: req.body.name,
        email: req.body.email
    };

    const user = await User.findByIdAndUpdate(req.user.id, updateUserData, {
        new: true,
        runValidators: true,
        useFindAndModify: false
    });

    res.status(200).json({
        success: true
    })
})

// -------------------------------- GET ALL USER FOR ADMIN (ADMIN)----------------------------------------------
const getAllUserController = asyncHandler(async (req, res, next) => {

    const users = await User.find();

    res.status(200).json({
        success: true,
        users
    });
});

// -------------------------------- GET SINGLE USER DETAIL FOR ADMIN(ADMIN)--------------------------------
const getSingleUserDetailController = asyncHandler(async (req, res, next) => {

    const user = await User.findById(req.params.id);

    if (!user) {
        return next(new ErrorHandler('User not Found', 400));
    }

    res.status(200).json({
        success: true,
        user
    });
});

// ------------------------------- UPDATE USER ROLE FOR ADMIN (ADMIN)-----------------------------------
const updateUserRoleController = asyncHandler(async (req, res, next) => {
    const updateUserData = {
        name: req.body.name,
        email: req.body.email,
        role: req.body.role
    };

    const user = await User.findByIdAndUpdate(req.params.id, updateUserData, {
        new: true,
        runValidators: true,
        useFindAndModify: false
    });

    if (!user) {
        return next(new ErrorHandler("User not Found", 400));
    }

    res.status(200).json({
        success: true
    })
})

// ---------------------------------DELETE USER FOR ADMIN (ADMIN) --------------------------------
const deleteUserController = asyncHandler(async (req, res, next) => {

    const user = await User.findById(req.params.id);

    if (!user) {
        return next(new ErrorHandler("User not Found", 400));
    }

    await user.remove();

    res.status(200).json({
        success: true,
        message: "Delete user Successfully"
    });
});

module.exports = { registerUserController, loginUserController, logoutUserController, forgotPasswordController, resetPasswordController, getUserDetailController, updatePasswordController, userProfileUpdateController, getAllUserController, getSingleUserDetailController, updateUserRoleController, deleteUserController };