const Coupon = require("../models/coupon");
const asyncHandler = require("express-async-handler");

const createNewCoupon = asyncHandler(async (req, res) => {
  const { name, discount, expiry } = req.body;
  if (!name || !discount || !expiry) throw new Error("Missing value");
  const response = await Coupon.create({
    ...req.body,
    expiry: Date.now() + +expiry * 24 * 60 * 60 * 1000,
  });
  return res.status(200).json({
    success: response ? true : false,
    createdCoupon: response ? response : "Cannot create new Coupon",
  });
});

const getCoupons = asyncHandler(async (req, res) => {
  const response = await Coupon.find().select("-createAt -updatedAt");
  return res.status(200).json({
    success: response ? true : false,
    coupons: response ? response : "Cannot get Coupons",
  });
});

const updateCoupon = asyncHandler(async (req, res) => {
  const { cid } = req.params;
  if (Object.keys(req.body).length === 0) throw new Error("Missing value");
  if (req.body.expiry)
    req.body.expiry = Date.now() + +req.body.expiry * 24 * 60 * 60 * 1000;
  const response = await Coupon.findByIdAndUpdate(cid, req.body, { new: true });
  return res.status(200).json({
    success: response ? true : false,
    updatedCoupon: response ? response : "Cannot update Coupon",
  });
});

const deleteCoupon = asyncHandler(async (req, res) => {
  const { cid } = req.params;
  const response = await Coupon.findByIdAndDelete(cid);
  return res.status(200).json({
    success: response ? true : false,
    deletedCoupon: response ? response : "Cannot delete Coupon",
  });
});

const validateCoupon = asyncHandler(async (req, res) => {
  const { name } = req.body;
  if (!name) throw new Error("Missing coupon code");
  const coupon = await Coupon.findOne({ name: name.toUpperCase() });
  if (!coupon) {
    return res.status(404).json({
      success: false,
      mes: "Mã giảm giá không tồn tại"
    });
  }
  if (new Date(coupon.expiry) < new Date()) {
    return res.status(400).json({
      success: false,
      mes: "Mã giảm giá đã hết hạn"
    });
  }
  return res.status(200).json({
    success: true,
    coupon
  });
});

module.exports = {
  createNewCoupon,
  getCoupons,
  updateCoupon,
  deleteCoupon,
  validateCoupon
};
