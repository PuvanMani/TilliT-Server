const AllRouters = require('express').Router();
const authRoute = require('./authRoute');
const orderRoute = require('./orderRoute');
const productRoute = require('./productRoute');


AllRouters.use("/api/v1", productRoute)
AllRouters.use("/api/v1", authRoute)
AllRouters.use("/api/v1", orderRoute)


module.exports = AllRouters;