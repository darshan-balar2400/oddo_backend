const Products = require("../Models/productModel");
const User = require("../Models/userModel");
const Orders = require("../Models/ordersModel");

const { CatchAsyncError, ErrorHandler } = require("nodejs-corekit");

const ReserveProducts = CatchAsyncError(async (req, res, next) => {
  const { acquiredTime, releaseTime, productId } = req.body;
  const user = req.user;
  const product = await Products.findById(productId);

  if (!product) {
    return next(new ErrorHandler("No product found!", 404));
  }

  const newAcquiredTime = new Date(acquiredTime).getTime();
  const newReleaseTime = new Date(releaseTime).getTime();

  let orders = await Orders.find({ productId: productId });

  if (orders && orders.length > 0) {
    const overlappingBooking = orders.some((order) => {
      const existingAcquiredTime = new Date(order.acquiredTime).getTime();
      const existingReleaseTime = new Date(order.releaseTime).getTime();

      console.log(existingAcquiredTime);
      console.log(existingReleaseTime);

      if (
        (newAcquiredTime < existingAcquiredTime || newAcquiredTime > existingReleaseTime) && (newReleaseTime > newAcquiredTime)
      ) {
        return false;
      }

      return true;
    });

    if (overlappingBooking) {
      return next(
        new ErrorHandler(
          "Product is already reserved for the specified time frame",
          400
        )
      );
    }
  }

  let document = {
    productId: product._id,
    acquiredTime: new Date(acquiredTime),
    releaseTime: new Date(releaseTime),
    user_id: user._id,
  };

  let newOrder = await Orders.create(document);

  // Add the new booking
  user.orders = user.orders.concat(newOrder);

  await user.save();

  res.json({
    success: true,
    message: "Product reserved successfully",
    product,
  });
});

module.exports = {
  ReserveProducts,
};
