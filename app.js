require("./Connection/conn");
const express = require("express");
const {Error} = require("nodejs-corekit");
const helmet = require("helmet");

const app = express();

app.get("/",(req,res) => {
    res.send("this is the first page");
});

app.use(helmet());
app.use(Error);

module.exports = app;