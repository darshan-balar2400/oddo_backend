const express = require('express');
const {
    rentProduct,
    handleFileUpload
} = require("../Controllers/ProductsController");

const Auth = require("../Middleware/Auth");

const route = new express.Router();

/* ----------------------------------------------- POST ROUTES ----------------------------------------------- */
route.post('/product/rent', Auth, rentProduct);
route.post('/product/upload', Auth, handleFileUpload);

module.exports = route;