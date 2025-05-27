const mongoose = require("mongoose");

// Schema chung cho tất cả loại embeddings
const createEmbeddingSchema = () => {
  const schema = new mongoose.Schema(
    {
      content: {
        type: String,
        required: true,
      },
      metadata: {
        sourceId: { 
          type: mongoose.Schema.Types.ObjectId
        },
        sourceCollection: String,
        title: String,
        slug: String,
        category: String,
        brand: String,
        tags: [String],
        author: String,
        price: Number,
        quantity: Number,
        sold: Number,
        totalRatings: Number,
        hasVariants: Boolean
      },
      embedding: {
        type: [Number],
        required: true,
      }
    },
    {
      timestamps: true,
    }
  );

  // Sẽ tạo index thủ công nếu cần thay vì sử dụng schema.index để tránh xung đột
  // KHÔNG tạo vector index ở đây vì sẽ được tạo thủ công trong Atlas UI
  // Vector index chỉ hoạt động trên Atlas M10+ clusters

  return schema;
};

// Khởi tạo các model với schema đã tạo
// Sử dụng try-catch để tránh lỗi khi model đã được định nghĩa
let ProductEmbedding, BlogEmbedding, CouponEmbedding, Embedding;

// Hàm an toàn để lấy hoặc tạo model
const getOrCreateModel = (modelName, schema) => {
  try {
    // Thử lấy model nếu đã tồn tại
    return mongoose.model(modelName);
  } catch (error) {
    // Nếu model chưa tồn tại, đăng ký mới
    return mongoose.model(modelName, schema);
  }
};

// Tạo và gán models
const embeddingSchema = createEmbeddingSchema();
ProductEmbedding = getOrCreateModel("ProductEmbedding", embeddingSchema);
BlogEmbedding = getOrCreateModel("BlogEmbedding", embeddingSchema);
CouponEmbedding = getOrCreateModel("CouponEmbedding", embeddingSchema);
Embedding = getOrCreateModel("Embedding", embeddingSchema);

// Đảm bảo các indexes đã được tạo - Sử dụng cách an toàn hơn
const ensureIndexes = async () => {
  try {
    // Kiểm tra và tạo text index cho content và metadata.title nếu cần
    const createTextIndex = async (model, indexName) => {
    try {
        // Tạo text index cho model
        console.log(`Tạo text index cho ${model.modelName}`);
        await model.collection.createIndex(
          { "content": "text", "metadata.title": "text" },
        {
            weights: { "metadata.title": 10, "content": 5 },
            name: indexName
        }
      );
    } catch (error) {
        console.warn(`Không thể tạo text index cho ${model.modelName}: ${error.message}`);
        // Lỗi index xung đột không gây crash app
      }
};

    // Thử tạo index nhưng không làm crash app nếu thất bại
    await Promise.allSettled([
      createTextIndex(ProductEmbedding, 'product_text_index'),
      createTextIndex(BlogEmbedding, 'blog_text_index'),
      createTextIndex(CouponEmbedding, 'coupon_text_index'),
      createTextIndex(Embedding, 'embedding_text_index')
    ]);
    
    console.log('Đã kiểm tra và xác nhận các text indexes cho embeddings');
  } catch (error) {
    console.error('Lỗi khi tạo indexes:', error);
    // Không làm crash app nếu có lỗi
  }
};

// Gọi hàm đảm bảo indexes - nhưng không block
ensureIndexes().catch(err => console.error('Failed to ensure indexes:', err));

module.exports = {
  ProductEmbedding,
  BlogEmbedding, 
  CouponEmbedding,
  Embedding, // giữ lại cho tương thích ngược
  createEmbeddingSchema, // export để có thể sử dụng cho Atlas
  ensureIndexes // export để có thể gọi từ server.js
};