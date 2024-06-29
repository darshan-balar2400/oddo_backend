// models/studentModel.js

const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    cellNumber: {
        type: Number,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
        minLength: 8,
    },
    rent_products: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
    }],
    buy_cart: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
    }],
});

const User = mongoose.model("User", userSchema);

module.exports = User;
