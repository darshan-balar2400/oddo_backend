require("dotenv").config();

const fs = require("fs");
const cloudinary = require("cloudinary").v2;

cloudinary.config({
    cloud_name: "dglpjgwnm",
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
});

module.exports = { uploadOnCloudinary };