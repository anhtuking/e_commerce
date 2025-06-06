const Product = require("../models/product");
const asyncHandler = require("express-async-handler");
const slugify = require("slugify");
const makeSKU = require("uniqid")
const { generateProductEmbedding } = require("../controllers/embedding");

const createProduct = asyncHandler(async (req, res) => {
  if (req.body.description && typeof req.body.description === 'string') {
    req.body.description = JSON.parse(req.body.description);
  }
  if (req.body.infomations && typeof req.body.infomations === 'string') {
    req.body.infomations = JSON.parse(req.body.infomations);
  }
  const {title, price, description, brand, category, color, infomations} = req.body
  const thumb = req?.files?.thumb[0]?.path
  const images = req.files?.images?.map(el => el.path)
  if (!(title && price && description && brand && category && color && infomations)) throw new Error("Missing inputs");
  req.body.slug = slugify(title);
  if (thumb) req.body.thumb = thumb
  if (images) req.body.images = images
  const newProduct = await Product.create(req.body);
  
  try {
    // Tạo embedding cho sản phẩm mới
    await generateProductEmbedding(newProduct);
    console.log(`Generated embedding for new product: ${newProduct.title}`);
  } catch (error) {
    console.log("Error generating embedding for new product:", error);
    // Không ảnh hưởng đến việc tạo sản phẩm nếu tạo embedding thất bại
  }
  
  return res.status(200).json({
    success: newProduct ? true : false,
    mes: newProduct ? "Create success!" : "Create fail!",
  });
});

const getProduct = asyncHandler(async (req, res) => {
  const { pid } = req.params;
  const product = await Product.findById(pid).populate({
    path: 'ratings',
    populate: {
      path: 'postedBy',
      select: 'firstname lastname avatar'
    }
  });
  return res.status(200).json({
    success: product ? true : false,
    dataProduct: product ? product : "Cannot get product",
  });
});

// Filtering, sorting & pagination
const getAllProducts = asyncHandler(async (req, res) => {
  const queries = { ...req.query };
  // Tách các trường đặc biệt ra khỏi query
  const excludeFields = ["limit", "sort", "page", "fields"];
  excludeFields.forEach((el) => delete queries[el]); // delete các trường ra khỏi object queries

  // Format lại các operators cho đúng cú pháp của mongoose
  let queryString = JSON.stringify(queries);
  queryString = queryString.replace(
    /\b(gte|gt|lt|lte)\b/g,
    (matchedEl) => `$${matchedEl}`
  );
  const formatedQueries = JSON.parse(queryString);
  let colorQueryObject = {}

  // Filtering
  if (queries?.title) formatedQueries.title = { $regex: queries.title, $options: "i" }; // 'i': không phân biệt hoa, thường
  if (queries?.category) formatedQueries.category = { $regex: queries.category, $options: 'i'}
  if (queries?.brand) formatedQueries.brand = { $regex: queries.brand, $options: 'i'}
  if (queries?.color) {
    delete formatedQueries.color
    const colorArr = queries.color?.split(',')
    const colorQuery = colorArr.map(el => ({color: {$regex: el, $options: 'i'}}))
    colorQueryObject= {$or: colorQuery}
  }
  let queryObj = {}
  if (queries?.q){
    delete formatedQueries.q
    queryObj= {$or: [
      {color: {$regex: queries.q, $options: 'i'}},
      {title: {$regex: queries.q, $options: 'i'}},
      {category: {$regex: queries.q, $options: 'i'}},
      {brand: {$regex: queries.q, $options: 'i'}}
    ]}
  }
  const q = {...colorQueryObject, ...formatedQueries, ...queryObj}
  let queryCommand = Product.find(q);

  // Sorting
  if (req.query.sort) {
    const sortBy = req.query.sort.split(",").join(" ");
    queryCommand = queryCommand.sort(sortBy);
  }

  // Fields limiting
  if (req.query.fields) {
    const fields = req.query.fields.split(",").join(" ");
    queryCommand = queryCommand.select(fields);
  }

  // Pagination
  const page = req.query.page || 1;
  const limit = req.query.limit || process.env.LIMIT_PRODUCTS;
  const skip = (page - 1) * limit;
  queryCommand.skip(skip).limit(limit);

  // Execute query
  try {
    // Thực thi truy vấn
    const response = await queryCommand;
    const counts = await Product.countDocuments(q);

    return res.status(200).json({
      success: true,
      counts,
      dataProducts: response,
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

const updateProduct = asyncHandler(async (req, res) => {
  const { pid } = req.params;
  if (req.body.description && typeof req.body.description === 'string') {
    req.body.description = JSON.parse(req.body.description);
  }
  if (req.body.infomations && typeof req.body.infomations === 'string') {
    req.body.infomations = JSON.parse(req.body.infomations);
  }
  const files = req?.files
  if (files?.thumb) req.body.thumb = files?.thumb[0]?.path 
  if (files?.images) req.body.images = files?.images?.map(el => el.path) 
  if (req.body && req.body.title) req.body.slug = slugify(req.body.title);
  const updatedProduct = await Product.findByIdAndUpdate(pid, req.body, {new:true});
  
  try {
    // Cập nhật embedding cho sản phẩm đã cập nhật
    await generateProductEmbedding(updatedProduct);
    console.log(`Updated embedding for product: ${updatedProduct.title}`);
  } catch (error) {
    console.log("Error updating embedding for product:", error);
    // Không ảnh hưởng đến việc cập nhật sản phẩm nếu cập nhật embedding thất bại
  }
  
  return res.status(200).json({
    success: updatedProduct ? true : false,
    updatedProduct: updatedProduct ? updatedProduct : "Cannot update product",
  });
});

const deleteProduct = asyncHandler(async (req, res) => {
  const { pid } = req.params;
  const deleted = await Product.findByIdAndDelete(pid);
  if (!deleted) {
    return res.status(404).json({
      success: false,
      mes: "Không thể xóa sản phẩm.",
    });
  }
  
  try {
    // Xóa embedding khi xóa sản phẩm
    const Embedding = require("../models/embedding");
    await Embedding.deleteOne({ "metadata.sourceId": pid });
    console.log(`Deleted embedding for product: ${deleted.title}`);
  } catch (error) {
    console.log("Error deleting embedding for product:", error);
    // Không ảnh hưởng đến việc xóa sản phẩm nếu xóa embedding thất bại
  }
  
  return res.status(200).json({
    success: true,
    mes: `Đã xóa sản phẩm "${deleted.title}" thành công.`,
  });
});

const ratingProduct = asyncHandler(async (req, res) => {
  const { id } = req.user;
  const { star, comment, pid, updatedAt } = req.body;
  if (!star || !pid) throw new Error("Missing value");
  const rating = await Product.findById(pid);
  // dùng hàm some để check uid === id => true, ngược lại => false
  const alreadyRating = rating?.ratings?.find((el) => el.postedBy.toString() === id.toString());
  // console.log({alreadyRating});
  if (alreadyRating) {
    // alreadyRating = true => update star & comment
    await Product.updateOne(
      {
        ratings: { $elemMatch: alreadyRating },
      },
      {
        $set: {
          "ratings.$.star": star,
          "ratings.$.comment": comment,
          "ratings.$.updatedAt": updatedAt,
        },
      },
      {
        new: true,
      }
    );
  } else {
    // alreadyRating = false => add star & comment
    await Product.findByIdAndUpdate(
      pid,
      {
        $push: { ratings: { star, comment, postedBy: id, updatedAt } },
      },
      {
        new: true,
      }
    );
  }

  // Sum ratings
  const updatedProduct= await Product.findById(pid)
  const countRatings = updatedProduct.ratings.length
  const sumRatings = updatedProduct.ratings.reduce((sum, el) => sum + (+el.star), 0)
  updatedProduct.totalRatings = Math.round(sumRatings * 10 / countRatings) / 10

  await updatedProduct.save()

  return res.status(200).json({
    success: true,
    updatedProduct
  });
});

// upload ảnh sản phẩm 
const uploadImagesProduct = asyncHandler(async(req, res) => {
  const {pid} = req.params
  const {title, price, color} = req.body
  const thumb = req?.files?.thumb[0]?.path
  const images = req.files?.images?.map(el => el.path)
  if (!(title && price && color)) throw new Error("Missing inputs");
  const response = await Product.findByIdAndUpdate(pid, {$push: {images: {$each: req.files.map(el => el.path)}}}, {new: true})
  return res.status(200).json({
    success: response ? true : false,
    uploadedImagesProduct: response ? response : 'Cannot upload images product'
  });
})

// thêm biến thể sản phẩm 
const addVariantProduct = asyncHandler(async(req, res) => {
  const {pid} = req.params
  const {title, price, color, quantity} = req.body
  let thumb, images;
  if (req.files?.thumb) {
    thumb = req.files.thumb[0].path;
  }
  if (req.files?.images) {
    images = req.files.images.map(el => el.path);
  }
  if (!(title && price && color && quantity)) throw new Error("Missing inputs");
  const response = await Product.findByIdAndUpdate(pid, {$push: {variants: {color, price, title, thumb, images, quantity, sku: makeSKU().toUpperCase()}}}, {new: true})
  return res.status(200).json({
    success: response ? true : false,
    mes: response ? "Add variant success" : 'Cannot add variants'
  });
})

module.exports = {
  createProduct,
  getProduct,
  getAllProducts,
  updateProduct,
  deleteProduct,
  ratingProduct,
  uploadImagesProduct,
  addVariantProduct
};
