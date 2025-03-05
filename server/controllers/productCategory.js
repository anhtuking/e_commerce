const ProductCategory = require("../models/productCategory");
const asyncHandler = require("express-async-handler");

const createCategory = asyncHandler(async (req, res) => {
    const response = await ProductCategory.create(req.body)
    return res.status(200).json({
        success: response ? true : false,
        createdCategory: response ? response : 'Cannot create new Product-Category'
    })
});

const getAllCategories = asyncHandler(async (req, res) => {
    const response = await ProductCategory.find()
    return res.status(200).json({
        success: response ? true : false,
        productCategories: response ? response : 'Cannot get Product-Category'
    })
});

const updateCategory = asyncHandler(async (req, res) => {
    const {pcid} = req.params
    const response = await ProductCategory.findByIdAndUpdate(pcid, req.body, {new: true})
    return res.status(200).json({
        success: response ? true : false,
        updatedCategory: response ? response : 'Cannot update Product-Category'
    })
});

const deleteCategory = asyncHandler(async (req, res) => {
    const {pcid} = req.params
    const response = await ProductCategory.findByIdAndDelete(pcid, req.body, {new: true})
    return res.status(200).json({
        success: response ? true : false,
        deletedCategoryCategory: response ? response : 'Cannot delete Product-Category'
    })
});

module.exports = {
  createCategory,
  getAllCategories,
  updateCategory,
  deleteCategory,
};
