const BlogCategory = require("../models/blogCategory");
const asyncHandler = require("express-async-handler");

const createBlogCategory = asyncHandler(async (req, res) => {
    const response = await BlogCategory.create(req.body)
    return res.status(200).json({
        success: response ? true : false,
        createdCategory: response ? response : 'Cannot create new Blog-Category'
    })
});

const getAllBlogCategories = asyncHandler(async (req, res) => {
    const response = await BlogCategory.find().select('id title')
    return res.status(200).json({
        success: response ? true : false,
        blogCategories: response ? response : 'Cannot get Blog-Category'
    })
});

const updateBlogCategory = asyncHandler(async (req, res) => {
    const {bcid} = req.params
    const response = await BlogCategory.findByIdAndUpdate(bcid, req.body, {new: true})
    return res.status(200).json({
        success: response ? true : false,
        updatedCategory: response ? response : 'Cannot update Blog-Category'
    })
});

const deleteBlogCategory = asyncHandler(async (req, res) => {
    const {bcid} = req.params
    const response = await BlogCategory.findByIdAndDelete(bcid, req.body, {new: true})
    return res.status(200).json({
        success: response ? true : false,
        deletedCategoryCategory: response ? response : 'Cannot delete Blog-Category'
    })
});

module.exports = {
  createBlogCategory,
  getAllBlogCategories,
  updateBlogCategory,
  deleteBlogCategory,
};
