require("./Connection/conn");
const express = require("express");
const { Error } = require("nodejs-corekit");
const helmet = require("helmet");
const cors = require("cors");
const CookieParser = require("cookie-parser");

const UserRoutes = require("./Routes/userRoutes.js");
const ProductRoutes = require("./Routes/productRoutes.js");
const CollectionRoutes = require("./Routes/collectionRoutes.js");
const OrdersRoutes = require("./Routes/orderRoutes.js");
const app = express();

app.use(CookieParser());
// app.use(helmet());
app.use(cors());
app.use(express.json());

app.use(UserRoutes);
app.use(ProductRoutes);
app.use(CollectionRoutes);
app.use(OrdersRoutes);

app.use(Error);

module.exports = app;
