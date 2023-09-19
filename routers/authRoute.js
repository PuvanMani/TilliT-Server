const AuthMethods = new (require('../modules/authModule.js/authModule'));

const authRoute = require('express').Router();


authRoute.route("/auth/register").post(AuthMethods.registerUser);
authRoute.route("/auth/login").post(AuthMethods.loginUser);
authRoute.route("/auth/logout").get(AuthMethods.logoutUser);
authRoute.route("/auth/password/forgot").post(AuthMethods.forgotPassword);
authRoute.route("/auth/password/reset/:token").post(AuthMethods.resetPassword);

module.exports = authRoute;