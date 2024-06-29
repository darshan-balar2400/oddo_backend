
const {ErrorHandler} = require("nodejs-corekit");
const CatchAsyncError = require("../Utils/CatchAsyncError");

const CreateJwtToken = CatchAsyncError(async (user, status, res) => {

    const token = await user.genereteToken();

    // store token in the cookie
    res.cookie("user", token, {
        expires: new Date(new Date().getTime() + 1000 * 60 * 60 * 24 * 365),
        secure: false,
        httpOnly: false
    });

    res.status(201).json({success: true, user});

});

module.exports = CreateJwtToken;
