require("dotenv").config();

const { uploadOnCloudinary } = require("../Config/cloudinary");

const Products = require('../Models/productModel');

const { CatchAsyncError} = require("nodejs-corekit")

const rentProduct = CatchAsyncError(async (req, res) => {
    const user = req.user;
    const { product_name , description , rental_price } = req.body;
    const product = await Products.findOne({ product_name });
    if (product) {
      return res.status(400).json({ message: 'Same product name encountered' });
    }
      const newProduct = {
        product_name,
        description,
        rental_price,
        available: true,
        user_id: req.user._id,
        // images: product.images,
      };
      await Products.create(newProduct);
      res.status(201).json({ message: 'Product added successfully'});
  });

  const handleFileUpload = async (req, res) => {
    try {
      if (req.file) {
        const result = await uploadOnCloudinary(req.file.path);
        console.log(result);
        res.json({ success: true, message: "File uploaded successfully" });
      } else {
        throw new Error("No file provided in the request");
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: error.message });
    }
  };

module.exports = {
  rentProduct,
  handleFileUpload
}