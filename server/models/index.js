const mongoose = require('mongoose');
const { dbConnect, getAtlasConnection } = require('../config/cloudDB');
const { ProductEmbedding, BlogEmbedding, CouponEmbedding, Embedding, createEmbeddingSchema } = require('./embedding');

// Map để lưu trữ các models đã tạo
const models = {};

// Hàm an toàn để tạo model
const safeCreateModel = (modelName, schema) => {
  try {
    // Kiểm tra xem model đã tồn tại chưa
    return mongoose.model(modelName);
  } catch (error) {
    // Nếu chưa tồn tại, tạo mới
    return mongoose.model(modelName, schema);
  }
};

// Khởi tạo kết nối và models
const initModels = async () => {
  try {
    // Kết nối MongoDB local cho các models thông thường
    await dbConnect();
    
    // Đăng ký các models chính
    const User = require('./user');
    const Product = require('./product');
    const Blog = require('./blog');
    const Coupon = require('./coupon');
    const Order = require('./order');
    const Payment = require('./payment');
    const Role = require('./role');
    const ProductCategory = require('./productCategory');
    const Brand = require('./brand');
    const BlogCategory = require('./blogCategory');
    
    // Lưu các models vào map
    models.User = User;
    models.Product = Product;
    models.Blog = Blog;
    models.Coupon = Coupon;
    models.Order = Order;
    models.Payment = Payment;
    models.Role = Role;
    models.ProductCategory = ProductCategory;
    models.Brand = Brand;
    models.BlogCategory = BlogCategory;
    
    // Thử kết nối MongoDB Atlas cho vector search
    try {
      // Kiểm tra nếu hàm getAtlasConnection tồn tại
      if (typeof getAtlasConnection === 'function') {
    const atlasConnection = await getAtlasConnection();
    
        // Chỉ cố gắng tạo models Atlas nếu có kết nối
    if (atlasConnection && process.env.HAS_VECTOR_SEARCH === 'true') {
      // Chỉ cố gắng tạo models Atlas nếu có kết nối
      try {
        // Import embedding schema nếu cần
        const { createEmbeddingSchema } = require('./embedding');
    
    // Tạo các models Atlas và lưu vào biến toàn cục
        global.atlasProductEmbeddingModel = safeCreateModel('ProductEmbedding', createEmbeddingSchema());
        global.atlasBlogEmbeddingModel = safeCreateModel('BlogEmbedding', createEmbeddingSchema());
        global.atlasCouponEmbeddingModel = safeCreateModel('CouponEmbedding', createEmbeddingSchema());
        global.atlasEmbeddingModel = safeCreateModel('Embedding', createEmbeddingSchema());
        
        return true;
      } catch (error) {
        // Không làm crash app khi tạo Atlas models thất bại
        return false;
      }
    } else {
      return false;
    }
      } else {
        return false;
      }
    } catch (error) {
      return false;
    }
    
    return true;
  } catch (error) {
    return false;
  }
};

// Hàm để lấy model đã khởi tạo
const getModel = (modelName) => {
  if (!models[modelName]) {
    throw new Error(`Model ${modelName} not initialized`);
  }
  return models[modelName];
};

module.exports = {
  initModels,
  getModel
};