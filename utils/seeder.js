const ProductData = require('../assets/JSON');
const Product = require('../schemas/productSchema/productSchema');
const connectDatabase = require('../config/database');


require('dotenv').config("../config/.env");
connectDatabase();


const seedProduct = async () => {
    try {
        await Product.deleteMany();
        console.log("Product Deleted")
        await Product.insertMany(ProductData);
        console.log("All Product Added")
    } catch (err) {
        console.log(err)
    }
    process.exit()
}

seedProduct();