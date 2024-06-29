require("./Connection/conn");
const express = require("express");
const {Error} = require("nodejs-corekit");
const helmet = require("helmet");
const CookieParser = require("cookie-parser");

const UserRoutes = require("./Routes/userRoutes.js");
const ProductRoutes = require("./Routes/productRoutes.js");
const CollectionRoutes = require("./Routes/collectionRoutes.js");

const app = express();

app.use(CookieParser());
app.use(helmet());
app.use(express.json());

app.use(UserRoutes);
app.use(ProductRoutes);
app.use(CollectionRoutes);

app.use(Error);

module.exports = app;