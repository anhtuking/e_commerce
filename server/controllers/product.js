const Product = require('../models/product')
const asyncHandler = require('express-async-handler')
const slugify = require('slugify')

const createProduct = asyncHandler(async (req, res) => {
    if (Object.keys(req.body).length === 0) throw new Error('Missing inputs')
    if (req.body && req.body.title) req.body.slug = slugify(req.body.title)
    const newProduct = await Product.create(req.body)
    return res.status(200).json({
        success: newProduct ? true : false,
        createdProduct: newProduct ? newProduct : 'Cannot create new product'
    })
})

const getProduct = asyncHandler(async (req, res) => {
    const {pid} = req.params
    const product = await Product.findById(pid)
    return res.status(200).json({
        success: product ? true : false,
        dataProduct: product ? product : 'Cannot get product'
    })
})

// Filtering, sorting & pagination 
const getAllProducts = asyncHandler(async (req, res) => {
    const queries = {...req.query}
    // Tách các trường đặc biệt ra khỏi query 
    const excludeFields = ['limit', 'sort', 'page', 'fields']
    excludeFields.forEach(el => delete queries[el])     // delete các trường ra khỏi object queries 

    // Format lại các operators cho đúng cú pháp của mongoose 
    let queryString = JSON.stringify(queries);
    queryString = queryString.replace(/\b(gte|gt|lt|lte)\b/g, (matchedEl) => `$${matchedEl}`);
    const formatedQueries = JSON.parse(queryString);

    // Filtering
    if (queries?.title) formatedQueries.title = {$regex: queries.title, $options: 'i'}   // 'i': không phân biệt hoa, thường 
    let queryCommand = Product.find(formatedQueries)

    // Sorting
    if (req.query.sort){
        const sortBy = req.query.sort.split(',').join(' ')
        queryCommand = queryCommand.sort(sortBy)
    }

    // Fields limiting
    // Pagination

    // Execute query
    try {
        // Thực thi truy vấn
        const response = await queryCommand;
        const counts = await Product.countDocuments(formatedQueries);

        return res.status(200).json({
            success: true,
            dataProducts: response,
            counts,
        });
    } catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
});

const updateProduct = asyncHandler(async (req, res) => {
    const {pid} = req.params
    if (req.body && req.body.title)req.body.slug = slugify(req.body.title)
    const updatedProduct = await Product.findByIdAndUpdate(pid, req.body)
    return res.status(200).json({
        success: updatedProduct ? true : false,
        updatedProduct: updatedProduct ? updatedProduct : 'Cannot update product'
    })
})

const deleteProduct = asyncHandler(async (req, res) => {
    const {pid} = req.params
    const deletedProduct = await Product.findByIdAndDelete(pid)
    return res.status(200).json({
        success: deletedProduct ? true : false,
        deletedProduct: deletedProduct ? deletedProduct : 'Cannot delete product'
    })
})

module.exports = {
  createProduct,
  getProduct,
  getAllProducts,
  updateProduct,
  deleteProduct
};
