const Order = require("../models/order");
const User = require("../models/user");
const asyncHandler = require("express-async-handler");

const createNewOrder = asyncHandler(async (req, res) => {
    const {id} = req.user
    const userCart = await User.findById(id).select('cart')
    return res.status(200).json({
        success: userCart ? true : false,
        createdOrder: userCart ? userCart : 'Cannot create new Blog'
    })
});


module.exports = {
    createNewOrder,
}