const express = require('express');
const {
    CreateUser,
    LoginUser,
    LogoutUser,
    ViewProfile,
    UpdateProfile
} = require("../Controllers/UserController");
const Auth = require("../Middleware/Auth");
const { AddToCart, GetCarts, RemoveToCart, ClearCart } = require('../Controllers/CartController');
const { ReserveProducts } = require('../Controllers/ProductsController');

const route = new express.Router();

/* ----------------------------------------------- POST ROUTES ----------------------------------------------- */
route.post('/user/new', CreateUser);
route.post('/user/login', LoginUser);
route.post("/user/logout", Auth, LogoutUser);
route.post("/user/cart/:id",Auth,AddToCart);
route.post("/user/reserve",Auth,ReserveProducts);
/* ----------------------------------------------- GET ROUTES ----------------------------------------------- */
route.get('/user/profile', Auth, ViewProfile);
route.get("/user/cart",Auth,GetCarts);

/* ----------------------------------------------- UPDATE ROUTES ----------------------------------------------- */
route.patch("/user/profile/update", Auth, UpdateProfile);

/* ----------- DELETE ------- */
route.delete("/user/cart/:id",Auth,RemoveToCart);
route.delete("/user/cart/all/clear",Auth,ClearCart);

module.exports = route;
