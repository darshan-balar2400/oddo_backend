const express = require('express');
const {
    rentProduct,
    handleFileUpload,
    UpdateProduct,
    DeleteProduct,
    GetProducts
} = require("../Controllers/ProductsController");
const multer = require("multer");
const uploadDest = multer({ dest: "uploads/" });

const Auth = require("../Middleware/Auth");

const route = new express.Router();

/* ---------- GET ROUTES ------------ */

route.get("/products",GetProducts);
/* ----------------------------------------------- POST ROUTES ----------------------------------------------- */
route.post('/product/rent', Auth, rentProduct);
route.post("/product/upload", uploadDest.single("file"), Auth, handleFileUpload);//

/* ------------------------- COMMON ROUTES ----------------- */

route.route("/product/rent/:id").delete(Auth,DeleteProduct).patch(Auth,UpdateProduct);

module.exports = route;