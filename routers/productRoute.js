const { isAuthendicate, authorizeRoles } = require('../middilewares/authenticate');
const ProductMethords = new (require('../modules/product/prodectModule'));
const productRoute = require('express').Router();


productRoute.route("/products").get(isAuthendicate, authorizeRoles('admin'), ProductMethords.ListProduct);
productRoute.route("/product/create").post(isAuthendicate, authorizeRoles('admin'), ProductMethords.CreateNewProduct);
productRoute.route("/product/:id")
    .get(ProductMethords.ListSingleProduct)
    .put(ProductMethords.UpdateProduct)
    .delete(ProductMethords.DeleteProduct)




module.exports = productRoute;