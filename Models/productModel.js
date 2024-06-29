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
    rental_price:
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
    collection_type:{
        type: String
    },
    images: {
        type: [media],
        required: false,
    }
},{
    timestamps:true
});

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
