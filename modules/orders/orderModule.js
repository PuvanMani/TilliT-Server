const catchAsyncerror = require("../../middilewares/catchAsyncerror");
const Order = require("../../schemas/orderSchema/ordersSchema");
const Product = require("../../schemas/productSchema/productSchema");
const ErrorHandler = require("../../utils/errorHandler");

function OrderMethods() {

}

// Create Order - /api/v1/order/create
OrderMethods.prototype.createOrder = catchAsyncerror(async function (req, res, next) {

    const { OrderItems, ShippingInfo, ItemPrice, TaxPrice, TotalPrice, PaymentInfo } = req.body


    const order = await Order.create({
        OrderItems,
        ShippingInfo,
        ItemPrice,
        TaxPrice,
        TotalPrice,
        PaymentInfo,
        PaidAt: Date.now(),
        CreatedBy: req.user.id
    })

    res.status(200).json({
        status: true,
        order
    })
})


// Get Purticular Order List -/api/v1/order/:id
OrderMethods.prototype.getSingleOrder = catchAsyncerror(async function (req, res, next) {

    const order = await Order.findById(req.params.id).populate('CreatedBy', "FullName Email");

    if (!order) {
        return next(new ErrorHandler(`Order Not Found with this id ${req.params.id}`, 404))
    }
    res.status(200).json({
        status: true,
        order
    })
})

// Get all Order for Purticular user -/api/v1/orders/myorders
OrderMethods.prototype.myOrders = catchAsyncerror(async function (req, res, next) {

    const order = await Order.find({ CreatedBy: req.user.id });

    res.status(200).json({
        status: true,
        order
    })
})



// Admin

// Get all Order -/api/v1/orders
OrderMethods.prototype.getAllOrders = catchAsyncerror(async function (req, res, next) {

    const order = await Order.find();

    let totalAmount = 0;
    order.forEach(order => totalAmount += order.TotalPrice)

    res.status(200).json({
        status: true,
        totalAmount,
        order
    })
})

// Delete Order - /api/v1/order/:id  
OrderMethods.prototype.deleteOrders = catchAsyncerror(async function (req, res, next) {

    const order = await Order.findById(req.params.id);

    if (!order) {
        return next(new ErrorHandler(`Order Not Found with this id ${req.params.id}`, 404))
    }
    await order.deleteOne();

    res.status(200).json({
        status: true
    })
})


// Update Order - /api/v1/order/:id  
OrderMethods.prototype.updateOrder = catchAsyncerror(async function (req, res, next) {

    const order = await Order.findById(req.params.id);

    // check if the order status is already Delivered
    if (order.OrderStatus == 'Delivered') {
        return next(new ErrorHandler(`Order has been already deliverd`, 404))
    }

    // Update the Stock quantity
    order.OrderItems.forEach(async orderitem => {
        await updateStock(orderitem.ProductID, orderitem.Quantity, orderitem.NetQuantity)
    })

    order.OrderStatus = req.body.OrderStatus;
    order.DeliveryAt = Date.now();
    await order.save();


    res.status(200).json({
        status: true,
    })
})

// Update Stock quantity Function
async function updateStock(productid, quantity, netQuantity) {
    const product = await Product.findById(productid)
    product.Stock = product.Stock - (quantity * netQuantity / 1000)
    product.save({ validateBeforeSave: false })
}



module.exports = OrderMethods;
