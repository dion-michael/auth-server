const { Schema, model } = require('mongoose');

const ProductSchema = new Schema({
    name: {
        type: String,
        required: [true, 'product_name is required'],
        validate: {
            validator: async function (value) {
                const product = await Product.findOne({name: value});
                return product ? false : true;
            },
            message: props => `product ${props.value} already exists`,
        },
    },
    description: {
        type: String,
        required: [true, 'description is required'],
    },
    price: {
        type: Number,
        min: 0,
        required: [true, 'price is required'],
    },
    image: {
        type: String,
        default: 'https://via.placeholder.com/150'
    },
    createdBy: {
        type: String,
        default: 'Anonymous'
    }
});

const Product = model('Product', ProductSchema);

module.exports = Product;
