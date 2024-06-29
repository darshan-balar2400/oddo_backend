const express = require('express');
const {
    CreateUser,
    LoginUser,
    LogoutUser,
    ViewProfile,
} = require("../Controllers/UserController");
const Auth = require("../Middleware/Auth");

const route = new express.Router();

/* ----------------------------------------------- POST ROUTES ----------------------------------------------- */
route.post('/user/new', CreateUser);
route.post('/user/login', LoginUser);
route.post("/user/logout", Auth, LogoutUser);
/* ----------------------------------------------- GET ROUTES ----------------------------------------------- */
route.get('/user/profile', Auth, ViewProfile);

module.exports = route;
