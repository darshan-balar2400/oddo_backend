// models/studentModel.js

const mongoose = require("mongoose");

const media = new mongoose.Schema({
    url: {
        type: String,
        required: true,
    },
});

const productSchema = new mongoose.Schema({
    product_name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    renatal_price:
    {
        type: Number,
        required: true,
    },
    available: {
        type: Boolean,
        required: true,
    },
    user_id: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: "User"
    },
    images: {
        type: [media],
        required: true,
    }
});

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
