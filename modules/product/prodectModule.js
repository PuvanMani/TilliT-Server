const Product = require("../../schemas/productSchema/productSchema");
const ErrorHandler = require('../../utils/errorHandler');
const catchAsyncError = require('../../middilewares/catchAsyncerror');

const APIFeatures = new (require('../../utils/apiFeatures'))

function ProductMethords() {

}


// List all Product - /api/v1/products
ProductMethords.prototype.listProduct = catchAsyncError(async function (req, res, next) {
    if (req.query.action == "page") {
        const products = await APIFeatures.Pagenate(Product.find(), req.query)
        return res.status(201).json({
            status: true,
            count: products.length,
            products
        });
    }
    if (req.query.action == "filter") {
        const products = await APIFeatures.Filter(Product.find(), req.query)
        return res.status(201).json({
            status: true,
            count: products.length,
            products
        });
    }
    if (req.query.action == "search") {
        const products = await APIFeatures.Search(Product.find(), req.query)
        return res.status(201).json({
            status: true,
            count: products.length,
            products
        });
    }
    const products = await Product.find()
    return res.status(201).json({
        status: true,
        count: products.length,
        products
    });
})


// List Single  Product - /api/v1/product/:id
ProductMethords.prototype.listSingleProduct = catchAsyncError(async function (req, res, next) {

    const product = await Product.findById(req.params.id);
    if (!product) {
        return next(new ErrorHandler("Product Not Found", 400))
    }

    res.status(201).json({
        status: true,
        product
    });
});


// Delete Product - /api/v1/product/:id
ProductMethords.prototype.deleteProduct = catchAsyncError(async function (req, res, next) {

    const product = await Product.findById(req.params.id);
    if (!product) {
        return res.status(404).json({
            status: false,
            message: "Product Not Found"
        });
    }
    await product.deleteOne();

    res.status(200).json({
        status: true,
        message: "Product Deleted"
    });
})


// Create Product - /api/v1/product/create
ProductMethords.prototype.createNewProduct = catchAsyncError(async function (req, res, next) {

    req.body.CreatedBy = req.user.id
    const product = await Product.create(req.body);
    res.status(201).json({
        status: true,
        product
    })
})

// Update Product - /api/v1/product/:id
ProductMethords.prototype.updateProduct = catchAsyncError(async function (req, res, next) {
    let product = await Product.findById(req.params.id);


    if (!product) {
        return res.status(404).json({
            status: false,
            message: "Product Not Found"
        });
    }
    product = await Product.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    })

    res.status(201).json({
        status: true,
        product
    })
})

// Create review and update - /api/v1/review
ProductMethords.prototype.createNewReview = catchAsyncError(async function (req, res, next) {
    const { ProductID, Rating, Comment } = req.body;

    const review = {
        user: req.user.id,
        Rating,
        Comment
    }
    const product = await Product.findById(ProductID)

    //check the user already post the review of this product
    const isReview = product.Reviews.find(review => {
        return review.user.toString() == req.user.id.toString()
    })

    //if the user already post the review on this product Update the review
    if (isReview) {
        product.Reviews.forEach(review => {
            if (review.user.toString() == req.user.id.toString()) {
                review.Comment = Comment
                review.Rating = Rating
            }
        })
    } else {
        //else create the review
        product.Reviews.push(review)
        product.NumOfReviews = product.Reviews.length
    }
    //getting the avarage of product ratings
    product.Ratings = product.Reviews.reduce((a, b) => {
        return b.Rating + a
    }, 0) / product.Reviews.length;

    //check product rating is Number or NaN
    product.Ratings = isNaN(product.Ratings) ? 0 : product.Ratings

    await product.save({ validateBeforeSave: false })

    res.status(201).json({
        status: true,
    })
})

// get all reviews - /api/v1/reviews
ProductMethords.prototype.getReviews = catchAsyncError(async function (req, res, next) {

    //getting all review form the product id
    let product = await Product.findById(req.query.id);

    if (!product) {
        return res.status(404).json({
            status: false,
            message: "Product Not Found"
        });
    }

    res.status(201).json({
        status: true,
        reviews: product.Reviews
    })
})

// delete review - /api/v1/review
ProductMethords.prototype.deleteReviews = catchAsyncError(async function (req, res, next) {

    let product = await Product.findById(req.query.productid);

    //filter the reviews form product reviews
    const reviews = product.Reviews.filter(review => review._id.toString() !== req.query.id.toString())

    //get avarage rating
    let Ratings = reviews.reduce((a, b) => {
        return b.Rating + a
    }, 0) / reviews.length;

    Ratings = isNaN(Ratings) ? 0 : Ratings;

    await Product.findByIdAndUpdate(req.query.productid, {
        Reviews: reviews,
        NumOfReviews: reviews.length,
        Ratings
    })

    res.status(201).json({
        status: true,
    })
})

module.exports = ProductMethords;