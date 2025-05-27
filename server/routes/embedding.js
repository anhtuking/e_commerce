const express = require("express");
const router = express.Router();
const { 
  generateAllProductEmbeddings,
  generateSingleProductEmbedding,
  searchSimilarProducts,
  searchMultipleCollections,
  generateAllBlogEmbeddings,
  generateSingleBlogEmbedding,
  generateAllCouponEmbeddings,
  generateSingleCouponEmbedding,
  getProductsWithEmbeddingStatus,
  generateMissingEmbeddings,
  getEmbeddingStats
} = require("../controllers/embedding");
const { isAdmin, verifyAccessToken } = require("../middlewares/verifyToken");

// Route để tạo embeddings cho tất cả sản phẩm 
router.post("/generate-all", [verifyAccessToken, isAdmin], generateAllProductEmbeddings);

// Route để tạo embedding cho một sản phẩm cụ thể
router.post("/generate/:pid", [verifyAccessToken, isAdmin], generateSingleProductEmbedding);

// Route để tìm kiếm sản phẩm tương tự bằng RAG
router.get("/search", searchSimilarProducts);

// Route để tìm kiếm qua nhiều collections
router.get("/search-multiple", searchMultipleCollections);

// Route để tạo embeddings cho tất cả blogs
router.post("/generate-all-blogs", [verifyAccessToken, isAdmin], generateAllBlogEmbeddings);

// Route để tạo embedding cho một blog cụ thể
router.post("/generate-blog/:bid", [verifyAccessToken, isAdmin], generateSingleBlogEmbedding);

// Routes cho coupon embeddings
router.post("/coupons/generate-all", [verifyAccessToken, isAdmin], generateAllCouponEmbeddings);
router.post("/coupons/generate/:id", [verifyAccessToken, isAdmin], generateSingleCouponEmbedding);

// Route để lấy danh sách sản phẩm kèm trạng thái embedding
router.get("/products-status", [verifyAccessToken, isAdmin], getProductsWithEmbeddingStatus);

// Route để tạo embeddings cho các sản phẩm mới chưa có embedding
router.post("/generate-missing", [verifyAccessToken, isAdmin], generateMissingEmbeddings);

// Route để lấy thống kê về embeddings
router.get("/stats", [verifyAccessToken, isAdmin], getEmbeddingStats);

module.exports = router; 