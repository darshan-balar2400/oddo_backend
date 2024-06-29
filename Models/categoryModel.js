const mongoose = require("mongoose");

const CollectionStructure = new mongoose.Schema({
    collection_name:{
        type:String,
        required:true
    }
});

const Collections = mongoose.model("collection",CollectionStructure);

module.exports = Collections;