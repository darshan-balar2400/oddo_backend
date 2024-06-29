const {ErrorHandler,CatchAsyncError} = require("nodejs-corekit");
const Collection = require("../Models/categoryModel");

const createCollection = CatchAsyncError(async(req,res,next) => {

    const body = req.body;

    console.log(body);

    let newCollection = await Collection.create(body);

    res.status(201).send({
        success:true,
        collection:newCollection
    });
});

const deleteCollection = CatchAsyncError(async(req,res,next) => {

    const id = req.params.id;

    let collection = await Collection.findByIdAndDelete({_id:id});

    res.status(200).send({
        success:true,
        collection,
        message:"Deleted Successfully !"
    })
});

const UpdateCollection = CatchAsyncError(async(req,res,next) => {

    let id = req.params.id;
    let body = req.body;

    let newCollection = await Collection.findByIdAndUpdate({_id:id},body,{new:true});

    res.status(200).send({
        success:true,
        collection:newCollection,
        message:"Updated Successfully !"
    })

});

module.exports = {
    createCollection,
    deleteCollection,
    UpdateCollection
}