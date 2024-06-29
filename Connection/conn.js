const mongoose = require('mongoose');

mongoose.connect("mongodb://localhost:27017/furniture_db").then((success) => {
    console.log("successfully connected to MongoDB");
}).catch((error) => {
    console.log("error connecting to MongoDB");
});