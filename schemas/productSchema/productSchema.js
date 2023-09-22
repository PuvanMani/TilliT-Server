const mongoose = require('mongoose')

const productSchema = new mongoose.Schema({
    Category: {
        type: String,
        required: [true, "Category is Required"],
        enum: {
            values: [
                "Vegitables",
                "Fruits",
            ],
            message: "Please Select Correct Category"
        }

    },
    ProductName: {
        type: String,
        required: [true, "Name is Required"]
    },
    MarketPrice: {
        type: Number,
        required: [true, "Market Price is Required"]
    },
    Price: {
        type: Number,
        required: [true, "Price is Required"],
        default: 0.0
    },
    Ratings: {
        type: Number,
        required: [true, "Ratings is Required"],
        default: 0
    },
    Stock: {
        type: Number,
        required: [true, "Stock is Required"],
        maxLength: [200, "Produt Stock Cannot exseen 200"]
    },
    NumOfReviews: {
        type: Number,
        default: 0
    },
    Reviews: [
        {
            user: mongoose.Schema.Types.ObjectId,
            Rating: {
                type: Number,
                required: true
            },
            Comment: {
                type: String,
                required: true
            }
        }
    ],
    Discription: {
        type: String,
        required: [true, "Discription is Required"],
    },
    CreatedDate: {
        type: Date,
        required: [true, "CreatedDate is Required"],
        default: Date.now()
    },
    NetQuantity: {
        type: Array,
        required: [true, "Net Quantity is Required"]
    },
    Images: [
        {
            Image: {
                type: String,
                required: [true, "Image is Required"]
            }
        }
    ],
    CreatedBy: {
        type: mongoose.Schema.Types.ObjectId,
        required: [true, "User is Required"]
    },
})



module.exports = mongoose.model("Product", productSchema)