const { CatchAsyncError, ErrorHandler } = require("nodejs-corekit");

const User = require("../Models/userModel");

const Products = require("../Models/productModel");

const AddToCart = CatchAsyncError(async (req, res, next) => {
  const _id = req.params.id;
  const user = req.user;
  const product = await Products.findById(_id);

  if (!product) {
    return next(new ErrorHandler("no product found!", 404));
  }

  if (user.buy_cart.length >= 10) {
    return next(
      new ErrorHandler("You can only add 10 products at a time in cart", 400)
    );
  }

  const isAdded = user.buy_cart.find((cart) => {
    return cart.toString() === _id.toString();
  });

  if(isAdded){
    return next(new ErrorHandler("Already added",400));
  }

  user.buy_cart = user.buy_cart.concat(_id);

  await user.save();
  let totalCart = user.buy_cart.length;

  res.status(200).json({
    cart: user.cart,
    totalItems: totalCart,
    success: true,
  });
});

const GetCarts = CatchAsyncError(async (req, res, next) => {
    const user = req.user;

    let cartData = await User.findById({_id:user._id},{buy_cart:1}).populate({
        path:"buy_cart"
    });

    let subtotal = 0;
  
    cartData.buy_cart.map(async(c, index) => {
        
        let finalPrice = c.rental_price;

        subtotal = subtotal + finalPrice;

    });
 
    let totalCart = user.buy_cart.length;

    res.status(200).json({
        cart: cartData,
        totalItems: totalCart,
        subtotal,
        success: true,
    })
});

const RemoveToCart = CatchAsyncError(async (req, res, next) => {
    const _id = req.params.id;
    const user = req.user;

    let isCartExists = user.buy_cart.find((c) => {
        return c.toString() === _id.toString();
    });

    if (! isCartExists) {
        return next(new ErrorHandler("Invalid Cart Id", 404));
    }

    user.buy_cart = user.buy_cart.filter((c) => {
        return c.toString() !== _id.toString();
    });

    await user.save();

    res.status(200).json({
        cart: user.buy_cart,
        success: true,
        totalItems: user.buy_cart.length,
    });
});

const ClearCart = CatchAsyncError(async (req, res, next) => {
    const user = req.user;
    user.buy_cart = [];
    await user.save();
    res.status(200).json({cart: user.buy_cart, success: true, totalItems: user.buy_cart.length});
});


module.exports = {
    AddToCart,
    GetCarts,
    RemoveToCart,
    ClearCart
}