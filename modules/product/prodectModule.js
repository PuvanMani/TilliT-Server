const Product = require("../../schemas/productSchema/productSchema");
const ErrorHandler = require('../../utils/errorHandler');
const catchAsyncError = require('../../middilewares/catchAsyncerror');

const APIFeatures = new (require('../../utils/apiFeatures'))

function ProductMethords() {

}


// List all Product - /api/v1/products
ProductMethords.prototype.ListProduct = catchAsyncError(async function (req, res, next) {
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
ProductMethords.prototype.ListSingleProduct = catchAsyncError(async function (req, res, next) {
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
ProductMethords.prototype.DeleteProduct = catchAsyncError(async function (req, res, next) {
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
ProductMethords.prototype.CreateNewProduct = catchAsyncError(async function (req, res, next) {

    req.body.CreatedBy = req.user.id
    const product = await Product.create(req.body);
    res.status(201).json({
        status: true,
        product
    })
})


// Update Product - /api/v1/product/:id
ProductMethords.prototype.UpdateProduct = catchAsyncError(async function (req, res, next) {
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
module.exports = ProductMethords;