const sendToken = (user, statusCode, res) => {

    //Creating JWT Token
    const token = user.getJwtToken();

    // Creating Cookes
    const options = {
        expires: new Date(Date.now() + process.env.COOKIE_EXPIRES * 24 * 60 * 60 * 1000),
        httpOnly: true,
    }

    res.status(201).cookie('token', token, options).json({
        status: true,
        user,
        token
    })
}

module.exports = sendToken;