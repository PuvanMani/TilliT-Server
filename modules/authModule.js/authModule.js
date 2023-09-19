const catchAsyncError = require('../../middilewares/catchAsyncerror');
const User = require('../../schemas/userSchema/userSchema');
const sendEmail = require('../../utils/Email');
const ErrorHandler = require('../../utils/errorHandler');
const sendToken = require('../../utils/jwt');
const crypto = require('crypto')
function AuthMethods() {

}


AuthMethods.prototype.registerUser = catchAsyncError(async function (req, res, next) {
    const { Email, Password, FullName } = req.body
    const user = await User.create({
        FullName,
        Email,
        Password
    })
    sendToken(user, 201, res)
})

AuthMethods.prototype.loginUser = catchAsyncError(async function (req, res, next) {
    const { Email, Password } = req.body

    if (!Email || !Password) {
        return next(new ErrorHandler("Please Enter Email or Password"), 400)
    }

    const user = await User.findOne({ Email }).select("+Password");

    if (!user) {
        return next(new ErrorHandler("Invalid Email or Password"), 401)
    }

    if (!await user.isValidPassword(Password)) {
        return next(new ErrorHandler("Invalid Email or Password"), 401)
    }

    sendToken(user, 201, res)

})

AuthMethods.prototype.logoutUser = function (req, res, next) {
    res.cookie('token', null, {
        expires: new Date(Date.now()),
        httpOnly: true
    }).status(200).json({
        status: true,
        message: "Loggedout"
    })
}
AuthMethods.prototype.forgotPassword = catchAsyncError(async function (req, res, next) {

    const user = await User.findOne({ Email: req.body.Email })

    if (!user) {
        return next(new ErrorHandler("User Not Found with this email", 404))
    }

    const resetToken = await user.getResetToken();

    await user.save({ validateBeforeSave: false })

    const resetUrl = `${req.protocol}://${req.get('host')}/api/v1/password/reset/${resetToken}`

    const message = ` Your Password Reset Url is as Follow \n\n ${resetUrl} \n\n If you not Requested this email, don't consider.`

    try {

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

        user.resetPasswordToken = undefined,
            user.resetPasswordTokenExpire = undefined,
            await user.save({ validateBeforeSave: false })
        return next(new ErrorHandler(error.message))
    }

})


AuthMethods.prototype.resetPassword = catchAsyncError(async function (req, res, next) {
    const resetPasswordToken = crypto.createHash('sha256').update(req.params.token).digest('hex');
    const user = await User.findOne({ resetPasswordToken, resetPasswordTokenExpire: { $gt: Date.now() } })

    if (!user) {
        return next(new ErrorHandler("Password reset token is invalid or expired"))
    }

    if (req.body.Password !== req.body.ConfirmPassword) {
        return next(new ErrorHandler("Password does not match"))
    }

    user.Password = req.body.Password;
    user.resetPasswordToken = undefined;
    user.resetPasswordTokenExpire = undefined;
    await user.save({ validateBeforeSave: false });
    sendToken(user, 201, res);
})

module.exports = AuthMethods;