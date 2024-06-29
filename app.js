require("./Connection/conn");
const express = require("express");

const app = express();

app.get("/",(req,res) => {
    res.send("this is the first page");
});


module.exports = app;