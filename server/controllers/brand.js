const Brand = require("../models/brand");
const asyncHandler = require("express-async-handler");

const createBrand = asyncHandler(async (req, res) => {
    const response = await Brand.create(req.body)
    return res.status(200).json({
        success: response ? true : false,
        createdBrand: response ? response : 'Cannot create new Brand'
    })
});

const getAllBrands = asyncHandler(async (req, res) => {
    const response = await Brand.find()
    return res.status(200).json({
        success: response ? true : false,
        getBrands: response ? response : 'Cannot get Brand'
    })
});

const updateBrand = asyncHandler(async (req, res) => {
    const {bid} = req.params
    const response = await Brand.findByIdAndUpdate(bid, req.body, {new: true})
    return res.status(200).json({
        success: response ? true : false,
        updatedBrand: response ? response : 'Cannot update Brand'
    })
});

const deleteBrand = asyncHandler(async (req, res) => {
    const {bid} = req.params
    const response = await Brand.findByIdAndDelete(bid, req.body, {new: true})
    return res.status(200).json({
        success: response ? true : false,
        deletedBrand: response ? response : 'Cannot delete Brand'
    })
});

module.exports = {
  createBrand,
  getAllBrands,
  updateBrand,
  deleteBrand,
};
