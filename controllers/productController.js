const Product = require("../models/Product")
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken');
const { CustomError } = require("../middlewares/ErrorHandler");

class ProductController{
    static async getAll(req, res, next){
        try {
            const products = await Product.find();
            const jsonProducts = products.map(product => product.toJSON())
            return res.json(jsonProducts);
        } catch (error) {
            next(error)
        }
    }

    static async createProduct(req, res, next){
        try {
            const { name, description, price, image } = req.body;
            const user = req.user;
            const product = new Product({
                name,
                description,
                price, 
                image,
                createdBy: user.username,
            });
            const savedProduct = await product.save();
            return res.json(savedProduct.toJSON());
        } catch (error) {
            next(error)
        }
    }

    static async deleteProduct(req, res, next) {
        try {
            const { product_id } = req.params; 
            const product = await Product.findByIdAndDelete(product_id);
            if (product) {
                return res.json(product)
            } else {
                throw new CustomError(404, 'product not found')
            }
        } catch (error) {
            next(error)
        }
    }
}

module.exports = ProductController;
