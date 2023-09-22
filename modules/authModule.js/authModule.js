const catchAsyncError = require('../../middilewares/catchAsyncerror');
const User = require('../../schemas/userSchema/userSchema');
const sendEmail = require('../../utils/Email');
const ErrorHandler = require('../../utils/errorHandler');
const sendToken = require('../../utils/jwt');
const crypto = require('crypto')
function AuthMethods() {

}

//register user - /api/v1/auth/register 
AuthMethods.prototype.registerUser = catchAsyncError(async function (req, res, next) {
    const { Email, Password, FullName } = req.body
    const user = await User.create({
        FullName,
        Email,
        Password
    })
    sendToken(user, 201, res)
})

//register user Otp Verification- /api/v1/auth/register/otp 
AuthMethods.prototype.registerUserOTP = catchAsyncError(async function (req, res, next) {
    const { Email } = req.body
    function GenerateOTP() {
        var digits = '0123456789';
        let OTP = '';
        for (let i = 0; i < 4; i++) {
            OTP += digits[Math.floor(Math.random() * 10)];
        }
        return OTP;
    }
    const OTP = GenerateOTP()
    const message = ` Your registration otp is ${OTP}. If you not Requested this email, don't consider.`
    sendEmail({
        email: Email,
        subject: "TilliT OTP Verification",
        message
    })

    res.status(200).json({
        status: true,
        otp: OTP
    })
})

//login user - /api/v1/auth/login 
AuthMethods.prototype.loginUser = catchAsyncError(async function (req, res, next) {
    const { Email, Password } = req.body

    if (!Email || !Password) {
        return next(new ErrorHandler("Please Enter Email or Password"), 400)
    }

    const user = await User.findOne({ Email }).select("+Password");

    if (!user) {
        return next(new ErrorHandler("Invalid Email or Password"), 401)
    }
    //check password is match
    if (!await user.isValidPassword(Password)) {
        return next(new ErrorHandler("Invalid Email or Password"), 401)
    }

    sendToken(user, 201, res)

})
//logout user - /api/v1/auth/logout 
AuthMethods.prototype.logoutUser = function (req, res, next) {
    res.cookie('token', null, {
        expires: new Date(Date.now()),
        httpOnly: true
    }).status(200).json({
        status: true,
        message: "Loggedout"
    })
}


//forgot password - /api/v1/auth/password/forgot 
AuthMethods.prototype.forgotPassword = catchAsyncError(async function (req, res, next) {

    const user = await User.findOne({ Email: req.body.Email })

    if (!user) {
        return next(new ErrorHandler("User Not Found with this email", 404))
    }
    //generating resettoken
    const resetToken = await user.getResetToken();

    await user.save({ validateBeforeSave: false })

    const resetUrl = `${req.protocol}://${req.get('host')}/api/v1/password/reset/${resetToken}`

    const message = ` Your Password Reset Url is as Follow \n\n ${resetUrl} \n\n If you not Requested this email, don't consider.`

    try {
        //send mail to the user
        sendEmail({
            email: user.Email,
            subject: "TilliT Password Recovery",
            message
        })
        res.status(200).json({
            status: true,
            message: `Email Sent to ${user.Email}`
        })


    } catch (error) {
        //remove the password reset token
        user.ResetPasswordToken = undefined
        user.ResetPasswordTokenExpire = undefined
        await user.save({ validateBeforeSave: false })
        return next(new ErrorHandler(error.message))
    }

})

// reset password - /api/v1/auth/password/reset/:token
AuthMethods.prototype.resetPassword = catchAsyncError(async function (req, res, next) {

    //genarating reset token
    const ResetPasswordToken = crypto.createHash('sha256').update(req.params.token).digest('hex');
    const user = await User.findOne({ ResetPasswordToken, ResetPasswordTokenExpire: { $gt: Date.now() } })

    if (!user) {
        return next(new ErrorHandler("Password reset token is invalid or expired"))
    }

    if (req.body.Password !== req.body.ConfirmPassword) {
        return next(new ErrorHandler("Password does not match"))
    }
    //change the password and save
    user.Password = req.body.Password;
    user.ResetPasswordToken = undefined;
    user.ResetPasswordTokenExpire = undefined;
    await user.save({ validateBeforeSave: false });
    sendToken(user, 201, res);
})

//get user Profile Info -/api/v1/auth/myprofile
AuthMethods.prototype.getUserProfile = catchAsyncError(async function (req, res, next) {
    const user = await User.findById(req.user.id)
    res.status(200).json({
        status: true,
        user
    })
})


//change the password - /api/v1/auth/password/change
AuthMethods.prototype.changePassword = catchAsyncError(async function (req, res, next) {
    const user = await User.findById(req.user.id).select("+Password");

    if (!await user.isValidPassword(req.body.oldPassword)) {
        return next(new ErrorHandler("Old Password is incorrect", 401))
    }


    user.Password = req.body.Password
    await user.save();

    res.status(200).json({
        status: true,
    })
})

//update user Profile - /api/v1/auth/myprofile/update
AuthMethods.prototype.updateProfile = catchAsyncError(async function (req, res, next) {
    const newUserData = {
        FullName: req.body.FullName,
        Email: req.body.Email
    }

    const user = await User.findByIdAndUpdate(req.user.id, newUserData, {
        new: true,
        runValidators: true,
    })

    res.status(200).json({
        status: true,
        user
    })
})


//Admin
// get all user details - /api/v1/admin/users
AuthMethods.prototype.getAllUsers = catchAsyncError(async function (req, res, next) {

    const user = await User.find()

    res.status(200).json({
        status: true,
        user
    })
})
// get specific user details - /api/v1/admin/user/:id
AuthMethods.prototype.getSpecificUser = catchAsyncError(async function (req, res, next) {

    const user = await User.findById(req.params.id);
    if (!user) {
        return next(new ErrorHandler(`User Not Found with this id : ${req.params.id}`))
    }

    res.status(200).json({
        status: true,
        user
    })
})
// update specific user details - /api/v1/admin/user/:id
AuthMethods.prototype.updateUser = catchAsyncError(async function (req, res, next) {
    const newUserData = {
        FullName: req.body.FullName,
        Email: req.body.Email,
        Role: req.body.Role
    }

    const user = await User.findByIdAndUpdate(req.params.id, newUserData, {
        new: true,
        runValidators: true,
    })

    res.status(200).json({
        status: true,
        user
    })
})
// delete specific user details - /api/v1/admin/user/:id
AuthMethods.prototype.deleteUser = catchAsyncError(async function (req, res, next) {

    const user = await User.findById(req.params.id);

    if (!user) {
        return next(new ErrorHandler(`User Not Found with this id : ${req.params.id}`))
    }

    await user.deleteOne();

    res.status(200).json({
        status: true,
    })
})




module.exports = AuthMethods;