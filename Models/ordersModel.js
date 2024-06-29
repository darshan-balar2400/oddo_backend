const mongoose = require("mongoose");

const OrderStructure = new mongoose.Schema({
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    acquiredTime: {
        type: String,
        required: true
    },
    releaseTime: {
        type: String,
        required: true
    },
    user_id:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', 
    }
});

const Orders =  mongoose.model("order",OrderStructure);


module.exports = Orders;
