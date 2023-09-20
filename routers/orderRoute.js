const { isAuthendicate, authorizeRoles } = require('../middilewares/authenticate');
const OrderMethods = new (require('../modules/orders/orderModule'));

const orderRoute = require('express').Router();

//User Route
orderRoute.route("/order/create").post(isAuthendicate, OrderMethods.createOrder);
orderRoute.route("/order/:id").get(isAuthendicate, OrderMethods.getSingleOrder);
orderRoute.route("/orders/myorders").get(isAuthendicate, OrderMethods.myOrders);

//Admin Route
orderRoute.route("/orders").get(isAuthendicate, authorizeRoles('admin'), OrderMethods.getAllOrders);
orderRoute.route("/order/:id").put(isAuthendicate, authorizeRoles('admin'), OrderMethods.updateOrder)
    .delete(isAuthendicate, authorizeRoles('admin'), OrderMethods.deleteOrders);


module.exports = orderRoute;