const {CatchAsyncError,ErrorHandler} = require("nodejs-corekit");


const AddToCart = CatchAsyncError(async (req, res, next) => {
    const _id = req.params.id;
    const user = req.user;
    const body = req.body;
    const product = await Product.findById(_id);

    if (! product) {
        return next(new ErrorHandler("no product found!", 404));
    }

    if (user.cart.length >= 10) {
        return next(new ErrorHandler("You can only add 10 products at a time in cart", 400));
    }

    const isAdded = user.cart.find((cart) => {
        return cart.product.id.toString() === _id.toString()
    });

    if (isAdded) {
        user.cart.forEach((cart) => {
            if (cart.product.id.toString() === _id.toString()) {
                cart.product = {
                    id: product._id,
                    name: product.p_name,
                    description: body.product.description,
                    price: product.p_price,
                    p_collection: product.p_collection,
                    avaibility_status: body.product.avaibility_status
                };
                cart.size = body.size;
            }
        });
    } else {
            user.cart = user.cart.concat({
                    product: {
                        id: product._id,
                        name: product.p_name,
                        img: body.product.img,
                        price: product.p_price,
                        s_charge: product.shipping_charge,
                        offer: body.product.offer ? {
                            offer_name: body.product.offer.offer_name,
                            id: body.product.offer.id
                        } : {},
                        discount: product.p_discount,
                        p_collection: product.p_collection,
                        stock: body.product.stock
                    },
                    color: body.color,
                    size: body.size,
                    quantity: body.quantity<= product.p_stock ? body.quantity : 1
        });
    }

    let subtotal = 0;
        let itemtotal = 0;
        let discount = 0;
        user.cart.map((c, index) => {
                        let finalPrice = c.product.price - Math.round((c.product.price * c.product.discount) / 100);

                        itemtotal = itemtotal + (c.product.price * c.quantity);

                        subtotal = subtotal + (finalPrice * c.quantity);

                    }
                );
                discount = discount + (itemtotal - subtotal);

                await user.save();
                let totalCart = user.cart.length;

                res.status(200).json({
                    cart: user.cart,
                    totalItems: totalCart,
                    subtotal,
                    success: true,
                    itemtotal,
                    discount
                })
            }
        );