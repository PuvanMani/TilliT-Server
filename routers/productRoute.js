const { isAuthendicate, authorizeRoles } = require('../middilewares/authenticate');
const ProductMethords = new (require('../modules/product/prodectModule'));
const productRoute = require('express').Router();

//User Route
productRoute.route("/product/:id")
    .get(ProductMethords.listSingleProduct)
    .put(ProductMethords.updateProduct)
    .delete(ProductMethords.deleteProduct)

productRoute.route("/review").post(isAuthendicate, ProductMethords.createNewReview)
productRoute.route("/reviews").get(isAuthendicate, ProductMethords.getReviews)
    .delete(isAuthendicate, ProductMethords.deleteReviews)

// Admin Route
productRoute.route("/products").get(ProductMethords.listProduct);
productRoute.route("/product/create").post(isAuthendicate, authorizeRoles('admin'), ProductMethords.createNewProduct);

module.exports = productRoute;