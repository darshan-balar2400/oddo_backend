require("dotenv").config();

const { uploadOnCloudinary } = require("../Config/cloudinary");

const Products = require('../Models/productModel');
const User = require("../Models/userModel");

const { CatchAsyncError} = require("nodejs-corekit")

const rentProduct = CatchAsyncError(async (req, res) => {
    const user = req.user;
    const { product_name , description , rental_price,collection_type } = req.body;
    const product = await Products.findOne({ product_name });

    if (product) {
      return res.status(400).json({ message: 'Same product name encountered' });
    }
      const product_info = {
        product_name,
        description,
        rental_price,
        available: true,
        collection_type,
        user_id: req.user._id,
        // images: product.images,
      };


      const newProduct = await Products.create(product_info);
      if(!newProduct){
        return next(new Error("Somethign went Wrong !",500));
      }

      let euser = await User.findById(user._id);
      euser.rented_products = euser.rented_products.concat(newProduct._id);
      await euser.save();

      res.status(201).json({ success:true, product:newProduct});
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

  const UpdateProduct = CatchAsyncError(async (req,res,next) => {
    const data = req.body;
    const _id = req.params.id;
    if (! data) {
        return next(new ErrorHandler("Please Fill The Fields"));
    }
    const keys = Object.keys(data);
    const validFields = ["product_name", "description", "rental_price","available"];
    
    const isValidUpdate = keys.every((key) => {
        return validFields.includes(key);
    });

    if (! isValidUpdate) {
        return next(new ErrorHandler("You Can Only Update Name & description & rentalPrice", 400));
    }

    const product = await Products.findByIdAndUpdate({
        _id: _id
    }, data, {new: true});
    res.status(200).json({success: true,product});
  });

  const DeleteProduct = CatchAsyncError(async(req,res,next) => {
    const _id = req.params.id;
    const product = await Products.findByIdAndDelete(_id);
    if (! product) {
        return next(new ErrorHandler("no product found!", 404));
    }

    let User = await User.findById(req.user._id);
    User.rented_products = User.rented_product.filter((product,index) =>{
      return product.toString() == _id.toString();
    });

    res.status(200).json({
            success: true, message: `product deleted successfully with id ${
            product.id
        }`
    })

  });

  const GetProducts = CatchAsyncError(async (req, res, next) => {

    let match = {};
    let sort = {};
    let aggregateQuery = [];
  
    // price filter
    let plt = req.query.plt || 1000000;
    let pgt = req.query.pgt || 0;
  
    if (plt || pgt) {
      match.rental_price = {
        $gte: parseInt(pgt),
        $lte: parseInt(plt),
      };
    }
  
    // collection type
    let pitem_type = req.query.collection_type;
    if (pitem_type) {
      match.collection_type = {
        $eq: pitem_type,
      };
    }
  
    // by location
    // let plocation = req.query.location;
    // if (plocation) {
    //   match.location = {
    //     $eq: plocatoin,
    //   };
    // }
  
    let pstatus = req.query.availability_status || "true";
    if (pstatus == "true") {
      match.available = {
        $eq: true,
      };
    }
    else{
      match.available = {
        $eq: false,
      };
    }
  
    // by_keyword
    let keywords = req.query.keywords;
    if (keywords) {
        match.product_name = {
            $regex: new RegExp(keywords.split(",").join("|"), "i")
        };
    }
  
    // // product categories
    // let pcategory = req.query.pcategory;
    // if (pcategory) {
    //   match.p_category = {
    //     $in: pcategory.split(","),
    //   };
    // }
  
    // // search
    let q = req.query.q;
  
    // sortBy
    let sortBy = req.query.sortBy || "";
    if (sortBy) {
      let sortItems = sortBy.split(",");
      sortItems.forEach((s) => {
        if (s !== "") {
          const parts = s.split(":");
          sort[parts[0]] = parts[1] === "desc" ? -1 : 1;
        }
      });
      aggregateQuery.push({ $sort: sort });
    }
  
    aggregateQuery.push(
      match
        ? {
            $match: {
              $and: [match],
            },
          }
        : {
            $match: {},
          }
    );
  
    let lengthProduct = await Products.aggregate(aggregateQuery);
    let totalProducts = lengthProduct.length;
    // limit & skip for the pagination
    let limit = req.query.limit;
    let skip = req.query.skip || 0;
  
    if (skip) {
      aggregateQuery.push({ $skip: Number(skip) });
    }
    if (limit) {
      aggregateQuery.push({ $limit: Number(limit) });
    }
  
    console.log(match);
    let aggregate = await Products.aggregate(aggregateQuery);
  
    let products = await Products.populate(aggregate, { path: "user_id" });
  
    if (q) {
      let arr = [];
      products.map((p) => {
        Object.keys(p).find((k) => {
          if (!Array.isArray(p[k])) {
            if (
              p[k]?.toString().toLowerCase().includes(q.toLowerCase().trim()) ===
              true
            ) {
              arr.push(p);
              return true;
            }
          }
        });
      });
      products = arr;
      totalProducts = arr.length;
    }
  
    if (!products) {
      return next(new ErrorHandler("no products found!", 404));
    }
  
    res
      .status(200)
      .json({
        success: true,
        totalProducts,
        pageProducts: products.length,
        products,
      });
  });

module.exports = {
  rentProduct,
  handleFileUpload,
  UpdateProduct,
  DeleteProduct,
  GetProducts
}