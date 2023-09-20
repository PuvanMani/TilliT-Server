const mongoose = require('mongoose')

const orderSchema = new mongoose.Schema({
    ShippingInfo: {
        Address: {
            type: String,
            required: true
        },
        City: {
            type: String,
            required: true
        },
        Pincode: {
            type: String,
            required: true
        },
        PhoneNumber: {
            type: String,
            required: true
        },
    },
    CreatedBy: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    OrderItems: [
        {
            ProductName: {
                type: String,
                required: true
            },
            Quantity: {
                type: Number,
                required: true
            },
            Image: {
                type: String,
                required: true
            },
            Price: {
                type: Number,
                required: true
            },
            NetQuantity: {
                type: Number,
                required: true
            },
            ProductID: {
                type: mongoose.Schema.Types.ObjectId,
                required: true,
                ref: 'Product'
            },
        }],
    ItemsPrice: {
        type: Number,
        required: true,
        default: 0.0
    },
    TaxPrice: {
        type: Number,
        required: true,
        default: 0.0
    },
    ShippingPrice: {
        type: Number,
        required: true,
        default: 0.0
    },
    TotalPrice: {
        type: Number,
        required: true,
        default: 0.0
    },
    PaidAt: {
        type: Date
    },
    DeliveryAt: {
        type: Date
    },
    OrderStatus: {
        type: String,
        req: true,
        default: "Proccessing"
    },
    CreatedAt: {
        type: Date,
        default: Date.now
    }

})

module.exports = mongoose.model("Order", orderSchema)