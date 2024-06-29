require("dotenv").config();

const fs = require("fs");
const cloudinary = require("cloudinary").v2;

cloudinary.config({
    cloud_name: "dglpjgwnm",
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
});

const uploadOnCloudinary = async (localFilePath, courseName, subjectName) => {
    try {
        fs.unlinkSync(localFilePath);
return response.url;
    } catch (error) {
    console.error("Upload to Cloudinary failed:", error);
    throw error;
}
};

module.exports = { uploadOnCloudinary };