// models/studentModel.js
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const validator = require("validator");
const {ErrorHandler} = require("nodejs-corekit");
const jwt = require("jsonwebtoken");

const UserStructure = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        validate: (value) => {
            if (! validator.isEmail(value)) {
                throw new ErrorHandler("Email is not in proper formate !", 422);
            }
        }
    },
    cellNumber: {
        type: Number,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
        validate: (value) => {
            if (! validator.isStrongPassword(value, {
                minSymbols: 1,
                minLowercase: 1,
                minUppercase: 1,
                minNumbers: 1,
                minLength: 8
            })) {
                throw new ErrorHandler("Please enter a valid password", 422);
            }
        }
    },
    rented_products: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
    }],
    orders: [{
        productId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product',
            required: true
        },
        acquiredTime: {
            type: String,
            required: true
        },
        releaseTime: {
            type: String,
            required: true
        }
    }],
    buy_cart: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
    }],
    tokens: [
        {
            token: {
                type: String
            }
        }
    ],

},{
    timestamps:true
});

UserStructure.pre("save", async function (next) {
    if (this.isModified("password")) {
        this.password = await bcrypt.hash(this.password, 12);
    }
    next();
});

UserStructure.methods.genereteToken = async function () {
    const user = this;
    const token = await jwt.sign({
        _id: user._id
    }, process.env.SECRET_KEY);
    user.tokens = user.tokens.concat({token: token});
    await user.save();

    return token;
}

UserStructure.methods.isValidOldPassword = async function (oldpassword) {
    const user = this;
    const isValid = await bcrypt.compare(oldpassword, user.password);
    if (! isValid) {
        throw new ErrorHandler("Old Password Is Not Currect !", 400);
    }

    return true;
}

UserStructure.statics.CheckCredentials = async function (email, password) {
    const isValidEmail = await User.findOne({email});
    if (! isValidEmail) {
        throw new ErrorHandler("Invalid Credentails", 401);
    }

    const isValidPassword = await bcrypt.compare(password, isValidEmail.password);
    if (! isValidPassword) {
        throw new ErrorHandler("Invalid Credentails", 401);
    }
    const user = isValidEmail;
    return user;
}

UserStructure.statics.isValidEmail = async function (email) {
    const isExistsEmail = await User.findOne({email: email});
    if (isExistsEmail) {
        return false;
    }
    return true;
}


const User = mongoose.model("User", UserStructure);

module.exports = User;
