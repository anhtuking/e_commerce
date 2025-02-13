const Blog = require("../models/blog");
const asyncHandler = require("express-async-handler");

const createNewBlog = asyncHandler(async (req, res) => {
    const {title, description, category} = req.body
    if (!title || !description || !category) throw new Error('Missing value')
    const response = await Blog.create(req.body)
    return res.status(200).json({
        success: response ? true : false,
        createdBlog: response ? response : 'Cannot create new Blog'
    })
});

const getAllBlogs = asyncHandler(async (req, res) => {
    const response = await Blog.find()
    return res.status(200).json({
        success: response ? true : false,
        blogs: response ? response : 'Cannot get all Blogs'
    })
});

const updateBlog = asyncHandler(async (req, res) => {
    const {bid} = req.params
    if (Object.keys(req.body).length === 0) throw new Error('Missing value')
    const response = await Blog.findByIdAndUpdate(bid, req.body, {new: true})
    return res.status(200).json({
        success: response ? true : false,
        updatedBlog: response ? response : 'Cannot update Blog'
    })
});

const deleteBlog = asyncHandler(async (req, res) => {
    const {bid} = req.params
    const response = await Blog.findByIdAndDelete(bid, req.body, {new: true})
    return res.status(200).json({
        success: response ? true : false,
        deletedBlog: response ? response : 'Cannot delete Blog'
    })
});

// LIKE & DISLIKE the Blog
const likeBlog = asyncHandler(async (req, res) => {
    const {id} = req.user       // lấy id của người like 
    const {bid} = req.params      // lấy bid để xác định blog được like
    if (!bid) throw new Error('Missing value')
    const blog = await Blog.findById(bid)
    // check xem user có dislike hay kh?
    const alreadyDisliked = blog?.dislikes?.find(el => el.toString() === id)
    if (alreadyDisliked){
        const response = await Blog.findByIdAndUpdate(bid, {$pull: {dislikes: id}}, {new: true})
        return res.status(200).json({
            success: response ? true : false,
            result: response
        }) 
    }
    // check xem user có like trước đó hay kh?
    const isLiked = blog?.likes?.find(el => el.toString() === id)
    if (isLiked){
        const response = await Blog.findByIdAndUpdate(bid, {$pull: {likes: id}}, {new: true})
        return res.status(200).json({
            success: response ? true : false,
            result: response
        }) 
    } else{
        const response = await Blog.findByIdAndUpdate(bid, {$push: {likes: id}}, {new: true})
        return res.status(200).json({
            success: response ? true : false,
            result: response
        })
    }
})

const dislikeBlog = asyncHandler(async (req, res) => {
    const {id} = req.user       // lấy id của người dislike 
    const {bid} = req.params      // lấy bid để xác định blog được dislike
    if (!bid) throw new Error('Missing value')
    const blog = await Blog.findById(bid)
    // check xem user có dislike hay kh?
    const alreadyLiked = blog?.likes?.find(el => el.toString() === id)
    if (alreadyLiked){
        const response = await Blog.findByIdAndUpdate(bid, {$pull: {likes: id}}, {new: true})
        return res.status(200).json({
            success: response ? true : false,
            result: response
        }) 
    }
    // check xem user có like trước đó hay kh?
    const isDisliked = blog?.dislikes?.find(el => el.toString() === id)
    if (isDisliked){
        const response = await Blog.findByIdAndUpdate(bid, {$pull: {dislikes: id}}, {new: true})
        return res.status(200).json({
            success: response ? true : false,
            result: response
        }) 
    } else{
        const response = await Blog.findByIdAndUpdate(bid, {$push: {dislikes: id}}, {new: true})
        return res.status(200).json({
            success: response ? true : false,
            result: response
        })
    }
})

module.exports = {
    createNewBlog,
    getAllBlogs,
    updateBlog,
    deleteBlog,
    likeBlog,
    dislikeBlog
}