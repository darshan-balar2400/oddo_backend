const {ErrorHandler,CatchAsyncError} = require("nodejs-corekit");
const User = require("../Models/userModel");


const CreateUser = CatchAsyncError(async (req, res, next) => {
    const data = req.body;
    
    console.log(data);

    const user = await User.create(data);
   
    /* --------- GENERATE JWT TOKEN --------------------*/
    res.status(201).send({
        success:true,
        user
    })

});

/* --------------------------------- LOGIN A USER ------------------------------------------------------ */
const LoginUser = CatchAsyncError(async (req, res, next) => {
    const {email, password} = req.body;
    if (!email || !password) {
        return next(new ErrorHandler("Please Fill The Field !", 422));
    }
    const isValidUser = await User.CheckCredentials(email, password);
    if (! isValidUser) {
        return next(new ErrorHandler("Invalid Credentials", 401));
    }

    const token = await isValidUser.genereteToken();

    // store token in the cookie
    res.cookie("user", token, {
        expires: new Date(new Date().getTime() + 1000 * 60 * 60 * 24 * 365),
        secure: false,
        httpOnly: false
    });

    res.status(201).json({success: true, isValidUser});
});

/* --------------------------------- VIEW PROFILE ------------------------------------------------------ */
const ViewProfile = CatchAsyncError(async (req, res, next) => {
    const user = req.user;
    if (! user) {
        return next(new ErrorHandler("Please Login !", 401));
    }
    res.status(200).json({success: true, user});
});

/* --------------------------------- LOGOUT USER  ------------------------------------------------------ */
const LogoutUser = CatchAsyncError(async (req, res, next) => {
    const user = req.user;
    // remove token from the database
    user.tokens = user.tokens.filter((t) => {
        return t.token !== req.token;
    });
    // destroy cookie
    res.clearCookie("user");
    await user.save();
    res.status(200).json({success: true,message:"Successfully logged out !"});
});

const UpdateProfile = CatchAsyncError(async (req, res, next) => {
    const data = req.body;
    if (! data) {
        return next(new ErrorHandler("Please Fill The Fields"));
    }
    const keys = Object.keys(data);
    const validFields = ["name", "email", "cellNumber"];
    const isValidUpdate = keys.every((key) => {
        return validFields.includes(key);
    });

    if (! isValidUpdate) {
        return next(new ErrorHandler("You Can Only Update Name & Email & cellNumber", 400));
    }

    const {email} = data;

    // check that -  is email already exists or not ?
    if (!email === req.user.email) {
        const isValidEmail = await User.isValidEmail(email);
        if (! isValidEmail) {
            return next(new ErrorHandler("Email is already exists", 400));
        }
    }

    const user = await User.findByIdAndUpdate({
        _id: req.user._id
    }, data, {new: true});
    res.status(200).json({success: true, message: user});

});




module.exports = {
    CreateUser,
    LoginUser,
    LogoutUser,
    ViewProfile,
    UpdateProfile
}