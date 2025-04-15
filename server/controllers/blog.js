const Blog = require("../models/blog");
const asyncHandler = require("express-async-handler");

const createNewBlog = asyncHandler(async (req, res) => {
    const {title, description, category, author} = req.body
    if (!title || !description || !category || !author) throw new Error('Missing value')
    const response = await Blog.create(req.body)
    return res.status(200).json({
        success: response ? true : false,
        createdBlog: response ? response : 'Cannot create new Blog'
    })
});

const getAllBlogs = asyncHandler(async (req, res) => {
    try {
        const { page = 1, limit = 5, search = '' } = req.query;
        const pageNum = parseInt(page);
        const limitNum = parseInt(limit);
        const skip = (pageNum - 1) * limitNum;

        // Build filter object based on search query
        const filter = {};
        if (search) {
            filter.$or = [
                { title: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } },
                { category: { $regex: search, $options: 'i' } }
            ];
        }

        // Get total count for pagination
        const totalCount = await Blog.countDocuments(filter);
        
        // Get blogs with pagination
        const blogs = await Blog.find(filter)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limitNum);

        return res.status(200).json({
            success: true,
            blogs: blogs || [],
            count: totalCount || 0,
            page: pageNum,
            limit: limitNum,
            pages: Math.ceil(totalCount / limitNum) || 0
        });
    } catch (error) {
        throw new Error('Lỗi khi lấy danh sách bài viết');
    }
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
    const {bid} = req.params;
    const response = await Blog.findByIdAndDelete(bid);
    return res.status(200).json({
        success: response ? true : false,
        deletedBlog: response ? response : 'Cannot delete Blog'
    });
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
// lọai bỏ những trường không muốn lấy ra
const excludeFields = '-refreshToken -password -role -createdAt -updatedAt -cart -wishlist -__v'
const getBlog = asyncHandler(async (req, res) => {
    const {bid} = req.params
    const blog = await Blog.findByIdAndUpdate(bid, {$inc: {numberViews: 1}}, {new: true})   // numberViews++
    .populate('likes', excludeFields)
    .populate('dislikes', excludeFields)
    return res.status(200).json({
        success: blog ? true : false,
        result: blog
    })
})

// upload ảnh blog 
const uploadImagesBlog = asyncHandler(async(req, res) => {
  const {bid} = req.params
  if (!req.file) throw new Error('Missing value')
  const response = await Blog.findByIdAndUpdate(bid, {image: req.file.path}, {new: true})
  return res.status(200).json({
    status: response ? true : false,
    uploadedImagesBlog: response ? response : 'Cannot upload images blog'
  });
})

module.exports = {
    createNewBlog,
    getAllBlogs,
    updateBlog,
    deleteBlog,
    likeBlog,
    dislikeBlog,
    getBlog,
    uploadImagesBlog,
}