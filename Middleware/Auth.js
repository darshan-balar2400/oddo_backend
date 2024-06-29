const jwt = require("jsonwebtoken");
const User = require("../Models/userModel");
const {CatchAsyncError,ErrorHandler} = require("nodejs-corekit")

const Auth = CatchAsyncError(async(req,res,next) => {
        const jwttoken = req.cookies.user;
        if(!jwttoken){
            return next(new ErrorHandler("Please Login",401));
        }
        const isValidUser = await jwt.verify(jwttoken,process.env.SECRET_KEY);
        if(!isValidUser){
            return next(new ErrorHandler("Please Login",401));
        }
        const user = await User.findById({_id:isValidUser._id});
        if(!user){
            return next(new ErrorHandler("Please Login",401));
        }
        
        req.user =  user;
        req.token = jwttoken;

        next();
});

module.exports = Auth;