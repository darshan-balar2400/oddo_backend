const express = require('express');
const Auth = require('../Middleware/Auth');
const { ReserveProducts } = require('../Controllers/OrderController');

const route = new express.Router();

route.post("/orders/reserver",Auth,ReserveProducts);


module.exports = route;