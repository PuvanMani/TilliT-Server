const AllRouters = require('express').Router();
const authRoute = require('./authRoute');
const productRoute = require('./productRoute');


AllRouters.use("/api/v1", productRoute)
AllRouters.use("/api/v1", authRoute)


module.exports = AllRouters;