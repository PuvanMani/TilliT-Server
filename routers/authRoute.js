const AuthMethods = new (require('../modules/authModule.js/authModule'));
const { isAuthendicate, authorizeRoles } = require('../middilewares/authenticate')
const authRoute = require('express').Router();

//User Route
authRoute.route("/auth/register").post(AuthMethods.registerUser);
authRoute.route("/auth/login").post(AuthMethods.loginUser);
authRoute.route("/auth/logout").get(AuthMethods.logoutUser);
authRoute.route("/auth/password/forgot").post(AuthMethods.forgotPassword);
authRoute.route("/auth/password/reset/:token").post(AuthMethods.resetPassword);
authRoute.route("/auth/myprofile").get(isAuthendicate, AuthMethods.getUserProfile);
authRoute.route("/auth/myprofile/update").put(isAuthendicate, AuthMethods.updateProfile);
authRoute.route("/auth/password/change").put(isAuthendicate, AuthMethods.changePassword);

//Admin Route
authRoute.route("/admin/users").get(isAuthendicate, authorizeRoles('admin'), AuthMethods.getAllUsers);
authRoute.route("/admin/user/:id").get(isAuthendicate, authorizeRoles('admin'), AuthMethods.getSpecificUser)
    .put(isAuthendicate, authorizeRoles('admin'), AuthMethods.updateUser)
    .delete(isAuthendicate, authorizeRoles('admin'), AuthMethods.deleteUser);


module.exports = authRoute;