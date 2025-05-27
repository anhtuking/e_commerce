const Product = require("../models/product");
const Embedding = require("../models/embedding");
const asyncHandler = require("express-async-handler");
const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config();

// Khởi tạo Google Generative AI với API key
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY);

// Hàm tạo embedding từ text sử dụng Gemini
const createEmbedding = async (text) => {
  try {
    // Sử dụng Gemini API để tạo embedding chất lượng cao
    const genModel = genAI.getGenerativeModel({ model: "embedding-001" });
    const result = await genModel.embedContent(text);
    const embedding = result.embedding.values;
    
    return embedding;
  } catch (error) {
    console.error("Error generating embedding:", error);
    
    // Fallback to simple embedding if API fails
    const simpleHash = text
      .toLowerCase()
      .split(' ')
      .map(word => word.charCodeAt(0) || 0)
      .reduce((a, b) => a + b, 0);
    
    const randomEmbedding = Array(768).fill(0).map((_, i) => 
      (Math.sin(i * simpleHash % 100) + 1) / 2
    );
    
    return randomEmbedding;
  }
};

// Tạo embedding cho một sản phẩm
const generateProductEmbedding = asyncHandler(async (product) => {
  try {
    // Tạo nội dung từ product để embedding
    const content = `
      Tên sản phẩm: ${product.title}
      Danh mục: ${product.category}
      Thương hiệu: ${product.brand}
      Giá: ${product.price}
      Mô tả: ${product.description && product.description.length > 0 ? product.description.join(" ") : ""}
      Thông tin: ${JSON.stringify(product.infomations)}
    `;

    // Tạo embedding vector từ nội dung
    const embedding = await createEmbedding(content);

    // Lưu embedding vào database
    const embeddingDoc = await Embedding.findOneAndUpdate(
      { "metadata.sourceId": product._id },
      {
        content,
        metadata: {
          sourceId: product._id,
          sourceCollection: "Product",
          title: product.title,
          slug: product.slug,
          category: product.category,
          brand: product.brand
        },
        embedding
      },
      { upsert: true, new: true }
    );

    return embeddingDoc;
  } catch (error) {
    console.error("Error generating product embedding:", error);
    throw new Error("Failed to generate product embedding");
  }
});

// API để tạo embedding cho tất cả sản phẩm
const generateAllProductEmbeddings = asyncHandler(async (req, res) => {
  try {
    const products = await Product.find({});
    
    const results = [];
    
    for (const product of products) {
      const embeddingDoc = await generateProductEmbedding(product);
      results.push({
        productId: product._id,
        productTitle: product.title,
        embeddingId: embeddingDoc._id
      });
    }
    
    res.json({
      success: true,
      message: `Generated embeddings for ${results.length} products`,
      results
    });
  } catch (error) {
    console.error("Error generating all embeddings:", error);
    throw new Error("Failed to generate all embeddings");
  }
});

// API để tìm kiếm sản phẩm tương tự bằng cách sử dụng RAG
const searchSimilarProducts = asyncHandler(async (req, res) => {
  try {
    const { query, limit = 5 } = req.query;
    
    if (!query) {
      return res.status(400).json({
        success: false,
        message: "Query parameter is required"
      });
    }
    
    // Tạo embedding cho query
    const queryEmbedding = await createEmbedding(query);
    
    // Kiểm tra xem Atlas Vector Search có khả dụng không
    // Mặc định là false nếu không có cấu hình
    let hasVectorSearch = process.env.HAS_VECTOR_SEARCH === "true";
    
    let similarProducts = [];
    
    // Thử sử dụng MongoDB Atlas Vector Search trước
    try {
      // Kiểm tra xem model có hỗ trợ aggregate không
      if (typeof Embedding.aggregate === 'function') {
        // Sử dụng MongoDB Atlas Vector Search
        const results = await Embedding.aggregate([
          {
            $vectorSearch: {
              index: "vector_index",
              path: "embedding",
              queryVector: queryEmbedding,
              numCandidates: 100,
              limit: parseInt(limit)
            }
          },
          {
            $match: {
              "metadata.sourceCollection": "Product" // Chỉ lấy embeddings của products
            }
          },
          {
            $lookup: {
              from: "products",
              localField: "metadata.sourceId",
              foreignField: "_id",
              as: "product"
            }
          },
          {
            $unwind: "$product"
          },
          {
            $project: {
              _id: 0,
              score: { $meta: "vectorSearchScore" },
              product: 1
            }
          }
        ]);
        
        similarProducts = results.map(item => item.product);
        
        // Nếu có kết quả từ vector search, trả về luôn
        if (similarProducts.length > 0) {
          return res.json({
            success: true,
            products: similarProducts,
            method: "vector_search"
          });
        }
      } else {
        console.log("Model.aggregate function not available, using fallback method");
      }
    } catch (err) {
      console.log("Vector search not available or error occurred, using fallback method");
      console.error("Vector search error:", err.message);
    }
    
    // Fallback: Nếu Vector Search không khả dụng hoặc không có kết quả
    console.log("Using fallback similarity search method");
    
    // MongoDB Compass - sử dụng tính toán similarity thủ công
    // Lấy tất cả embeddings và thực hiện tính toán similarity
    try {
      // Kiểm tra xem model có hàm find không
      if (typeof Embedding.find === 'function') {
        const allEmbeddings = await Embedding.find({
          "metadata.sourceCollection": "Product"
        });
        
        if (allEmbeddings.length === 0) {
          console.log("No embeddings found in database");
          return res.json({
            success: false,
            message: "No embeddings found in database",
            products: []
          });
        }
        
        console.log(`Found ${allEmbeddings.length} embeddings for similarity calculation`);
        
        // Hàm tính cosine similarity giữa hai vectors
        const cosineSimilarity = (vecA, vecB) => {
          let dotProduct = 0;
          let normA = 0;
          let normB = 0;
          
          for (let i = 0; i < vecA.length; i++) {
            dotProduct += vecA[i] * vecB[i];
            normA += vecA[i] * vecA[i];
            normB += vecB[i] * vecB[i];
          }
          
          if (normA === 0 || normB === 0) return 0;
          
          return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
        };
        
        // Tính toán cosine similarity với mỗi embedding
        const productEmbeddings = allEmbeddings.map(doc => ({
          id: doc.metadata.sourceId,
          embedding: doc.embedding,
          content: doc.content,
          similarity: cosineSimilarity(queryEmbedding, doc.embedding)
        }));
        
        // Sắp xếp theo similarity từ cao đến thấp
        const sortedEmbeddings = productEmbeddings.sort((a, b) => b.similarity - a.similarity);
        
        // Chỉ lấy top N embeddings
        const topEmbeddings = sortedEmbeddings.slice(0, limit);
        
        // Lấy thông tin chi tiết sản phẩm
        const productIds = topEmbeddings.map(item => item.id);
        
        const products = await Product.find({
          _id: { $in: productIds }
        });
        
        // Map các sản phẩm với điểm similarity của chúng
        const productsWithSimilarity = products.map(product => {
          const embeddingInfo = topEmbeddings.find(
            e => e.id.toString() === product._id.toString()
          );
          
          return {
            ...product.toObject(),
            similarity: embeddingInfo ? embeddingInfo.similarity : 0
          };
        });
        
        // Sắp xếp kết quả cuối cùng theo điểm similarity
        const sortedProducts = productsWithSimilarity.sort((a, b) => b.similarity - a.similarity);
        
        return res.json({
          success: true,
          products: sortedProducts,
          method: "cosine_similarity"
        });
      } else {
        console.log("Model.find function not available, returning empty results");
        // Trả về kết quả trống
        return res.json({
          success: false,
          message: "Search functions not available",
          products: []
        });
      }
    } catch (error) {
      console.error("Error in fallback search method:", error.message);
      // Trường hợp khẩn cấp: Trả về danh sách sản phẩm không có embedding
      const fallbackProducts = await Product.find().limit(parseInt(limit));
      
      return res.json({
        success: true,
        products: fallbackProducts,
        method: "fallback_direct_query"
      });
    }
  } catch (error) {
    console.error("Error searching similar products:", error);
    throw new Error("Failed to search similar products");
  }
});

// API để tạo embedding cho một sản phẩm mới hoặc cập nhật
const generateSingleProductEmbedding = asyncHandler(async (req, res) => {
  try {
    const { productId } = req.params;
    
    const product = await Product.findById(productId);
    
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found"
      });
    }
    
    const embeddingDoc = await generateProductEmbedding(product);
    
    res.json({
      success: true,
      message: `Generated embedding for product: ${product.title}`,
      embedding: embeddingDoc
    });
    
  } catch (error) {
    console.error("Error generating single product embedding:", error);
    throw new Error("Failed to generate single product embedding");
  }
});

// Hàm để truy vấn nhiều collection dựa trên context
const queryCollections = asyncHandler(async (query, collections = ["products"]) => {
  try {
    // Tạo embedding cho query
    const queryEmbedding = await createEmbedding(query);
    const results = {};
    
    // Map từ tên collection lúc gọi API sang tên Model trong MongoDB
    const collectionMapping = {
      "products": "Product",
      "blogs": "Blog",
      "coupons": "Coupon"
    };
    
    // Kiểm tra xem Atlas Vector Search có khả dụng không
    let hasVectorSearch = process.env.HAS_VECTOR_SEARCH === "true";
    
    // Truy vấn trong từng collection đã chỉ định
    for (const collection of collections) {
      // Convert tên collection sang tên Model
      const modelName = collectionMapping[collection] || null;
      if (!modelName) {
        continue;
      }
      
      let sourceData = [];
      
      // Nếu có Vector Search thì thử sử dụng
      if (hasVectorSearch) {
        try {
          const results = await Embedding.aggregate([
            {
              $vectorSearch: {
                index: "vector_index",
                path: "embedding",
                queryVector: queryEmbedding,
                numCandidates: 100,
                limit: 10
              }
            },
            {
              $match: {
                "metadata.sourceCollection": modelName
              }
            },
            {
              $project: {
                _id: 0,
                score: { $meta: "vectorSearchScore" },
                sourceId: "$metadata.sourceId"
              }
            }
          ]);
          
          // Lấy sourceIds từ kết quả Vector Search
          const sourceIds = results.map(item => item.sourceId);
          
          // Truy vấn model dựa trên sourceIds
          if (modelName === "Product") {
            const Product = require("../models/product");
            sourceData = await Product.find({ _id: { $in: sourceIds } });
          } else if (modelName === "Blog") {
            const Blog = require("../models/blog");
            sourceData = await Blog.find({ _id: { $in: sourceIds } });
          } else if (modelName === "Coupon") {
            const Coupon = require("../models/coupon");
            sourceData = await Coupon.find({ _id: { $in: sourceIds } });
          }
          
        } catch (error) {
          console.error(`Vector search error for ${modelName}:`, error);
          hasVectorSearch = false; // Fallback to manual calculation
        }
      }
      
      // Nếu không có Vector Search hoặc có lỗi, dùng tính toán thủ công
      if (!hasVectorSearch || sourceData.length === 0) {
        // Tìm embeddings có metadata.sourceCollection matching với tên Model
        const embeddingResults = await Embedding.find({
          "metadata.sourceCollection": modelName
        });
        
        if (embeddingResults.length === 0) {
          continue; // Không có embeddings cho collection này
        }
        
        // Hàm tính cosine similarity giữa hai vectors
        const cosineSimilarity = (vecA, vecB) => {
          // Đảm bảo vectors có cùng kích thước
          if (vecA.length !== vecB.length) {
            const minLength = Math.min(vecA.length, vecB.length);
            vecA = vecA.slice(0, minLength);
            vecB = vecB.slice(0, minLength);
          }
          
          const dotProduct = vecA.reduce((sum, a, i) => sum + a * vecB[i], 0);
          const magA = Math.sqrt(vecA.reduce((sum, a) => sum + a * a, 0));
          const magB = Math.sqrt(vecB.reduce((sum, b) => sum + b * b, 0));
          
          if (magA === 0 || magB === 0) return 0; // Tránh chia cho 0
          return dotProduct / (magA * magB);
        };
        
        // Sắp xếp kết quả theo độ tương đồng
        const similarities = embeddingResults
          .map(doc => ({
            embedding: doc,
            similarity: cosineSimilarity(queryEmbedding, doc.embedding)
          }))
          .filter(item => {
            // Giảm ngưỡng similarity cho coupons để tăng khả năng tìm kiếm
            const threshold = item.embedding.metadata.sourceCollection === "Coupon" ? 0.3 : 0.4;
            return item.similarity > threshold;
          })
          .sort((a, b) => b.similarity - a.similarity)
          .slice(0, 20);  // Top 20 kết quả
        
        if (similarities.length === 0) {
          continue; // Không có kết quả phù hợp
        }
        
        // Lấy ID nguồn và truy vấn dữ liệu
        const sourceIds = similarities.map(item => item.embedding.metadata.sourceId);
        
        // Truy vấn dữ liệu dựa trên collection
        if (modelName === "Product") {
          const Product = require("../models/product");
          sourceData = await Product.find({ _id: { $in: sourceIds } });
        } else if (modelName === "Blog") {
          const Blog = require("../models/blog");
          sourceData = await Blog.find({ _id: { $in: sourceIds } });
        } else if (modelName === "Coupon") {
          const Coupon = require("../models/coupon");
          sourceData = await Coupon.find({ _id: { $in: sourceIds } });
        }
      }
      
      // Lưu vào kết quả với tên collection gốc
      results[collection] = sourceData;
    }
    
    return results;
  } catch (error) {
    console.error("Error querying collections:", error);
    return {};
  }
});

// API để tìm kiếm trong nhiều collections (Products, Blogs, Coupons)
const searchMultipleCollections = asyncHandler(async (req, res) => {
  try {
    const { query, limit = 5, sourceType = 'all' } = req.query;
    
    if (!query) {
      return res.status(400).json({
        success: false,
        message: "Query parameter is required"
      });
    }
    
    // Tạo embedding cho query
    const queryEmbedding = await createEmbedding(query);
    
    // Xác định loại nguồn cần tìm
    let sourceFilter = {};
    if (sourceType && sourceType !== 'all') {
      const sourceTypes = sourceType.split(',');
      // Mapping từ tên collections đến tên trong metadata.sourceCollection
      const sourceCollectionMap = {
        'products': 'Product',
        'productembeddings': 'Product',
        'blogs': 'Blog', 
        'blogembeddings': 'Blog',
        'coupons': 'Coupon',
        'couponembeddings': 'Coupon'
      };
      
      const validSourceTypes = sourceTypes
        .map(type => sourceCollectionMap[type.toLowerCase()])
        .filter(Boolean);
      
      if (validSourceTypes.length > 0) {
        sourceFilter = { "metadata.sourceCollection": { $in: validSourceTypes } };
      }
    }
    
    let results = [];
    
    // Thử sử dụng Vector Search trước
    try {
      if (typeof Embedding.aggregate === 'function') {
        const vectorResults = await Embedding.aggregate([
          {
            $vectorSearch: {
              index: "vector_index",
              path: "embedding",
              queryVector: queryEmbedding,
              numCandidates: 100,
              limit: parseInt(limit) * 2 // Tìm nhiều hơn để có thể lọc
            }
          },
          {
            $match: sourceFilter
          },
          {
            $project: {
              _id: 1,
              content: 1,
              metadata: 1,
              score: { $meta: "vectorSearchScore" }
            }
          }
        ]);
        
        if (vectorResults && vectorResults.length > 0) {
          // Xử lý kết quả
          results = vectorResults.map(item => ({
            document: {
              ...JSON.parse(item.content),
              _id: item.metadata.sourceId
            },
            score: item.score,
            collection: item.metadata.sourceCollection.toLowerCase() + 'embeddings'
          }));
          
          // Cắt bớt kết quả theo limit
          results = results.slice(0, parseInt(limit));
          
          return res.json({
            success: true,
            method: "vector_search",
            results
          });
        }
      } else {
        console.log("Model.aggregate function not available, using fallback method");
      }
    } catch (err) {
      console.log("Vector search not available or error occurred, using fallback method");
      console.error("Vector search error:", err.message);
    }
    
    // Fallback: Sử dụng text search
    try {
      if (typeof Embedding.find === 'function') {
        // Text search với RegExp
        const textSearchQuery = query.split(' ')
          .filter(term => term.length > 2)
          .map(term => new RegExp(term, 'i'));
        
        const searchConditions = {
          $or: [
            { "content": { $all: textSearchQuery } },
            { "metadata.title": { $all: textSearchQuery } }
          ]
        };
        
        // Thêm filter nếu có
        if (sourceFilter["metadata.sourceCollection"]) {
          searchConditions["metadata.sourceCollection"] = sourceFilter["metadata.sourceCollection"];
        }
        
        const textResults = await Embedding.find(searchConditions)
          .limit(parseInt(limit));
        
        if (textResults && textResults.length > 0) {
          // Xử lý kết quả
          results = textResults.map(item => ({
            document: {
              ...JSON.parse(item.content),
              _id: item.metadata.sourceId
            },
            score: 0.5, // Giả lập điểm similarity
            collection: item.metadata.sourceCollection.toLowerCase() + 'embeddings'
          }));
          
          return res.json({
            success: true,
            method: "text_search",
            results
          });
        } else {
          console.log("No text search results, using direct query");
          
          // Super fallback: Truy vấn trực tiếp từ database
          const directResults = [];
          
          // Lấy sản phẩm
          if (!sourceFilter["metadata.sourceCollection"] || 
              sourceFilter["metadata.sourceCollection"].$in.includes('Product')) {
            const products = await Product.find({
              $or: [
                { title: { $regex: query, $options: 'i' } },
                { description: { $regex: query, $options: 'i' } }
              ]
            }).limit(parseInt(limit));
            
            directResults.push(...products.map(product => ({
              document: product,
              score: 0.3,
              collection: 'productembeddings'
            })));
          }
          
          // Thêm phần lấy blogs và coupons nếu cần
          
          return res.json({
            success: true,
            method: "direct_query",
            results: directResults.slice(0, parseInt(limit))
          });
        }
      } else {
        // Model.find không khả dụng - trả về rỗng
        console.log("Model.find function not available, returning empty results");
        return res.json({
          success: false,
          message: "Search functions not available",
          results: []
        });
      }
    } catch (error) {
      console.error("Error in fallback search method:", error.message);
      // Trả về kết quả trống trong trường hợp lỗi
      return res.json({
        success: false,
        message: "Search failed",
        results: []
      });
    }
  } catch (error) {
    console.error("Error searching multiple collections:", error);
    throw new Error("Failed to search multiple collections");
  }
});

// Tạo embedding cho một blog
const generateBlogEmbedding = asyncHandler(async (blog) => {
  try {
    // Tạo nội dung từ blog để embedding
    const content = `
      Tiêu đề: ${blog.title}
      Tóm tắt: ${blog.description || ""}
      Nội dung: ${blog.content || ""}
      Danh mục: ${blog.category || ""}
      Tags: ${blog.tags?.join(", ") || ""}
    `;

    // Tạo embedding vector từ nội dung
    const embedding = await createEmbedding(content);

    // Lưu embedding vào database
    const embeddingDoc = await Embedding.findOneAndUpdate(
      { "metadata.sourceId": blog._id },
      {
        content,
        metadata: {
          sourceId: blog._id,
          sourceCollection: "Blog",
          title: blog.title,
          slug: blog.slug,
          category: blog.category,
          tags: blog.tags,
          author: blog.author
        },
        embedding
      },
      { upsert: true, new: true }
    );

    return embeddingDoc;
  } catch (error) {
    console.error("Error generating blog embedding:", error);
    throw new Error("Failed to generate blog embedding");
  }
});

// API để tạo embedding cho tất cả blogs
const generateAllBlogEmbeddings = asyncHandler(async (req, res) => {
  try {
    const Blog = require("../models/blog");
    const blogs = await Blog.find({});
    
    const results = [];
    
    for (const blog of blogs) {
      const embeddingDoc = await generateBlogEmbedding(blog);
      results.push({
        blogId: blog._id,
        blogTitle: blog.title,
        embeddingId: embeddingDoc._id
      });
    }
    
    res.json({
      success: true,
      message: `Generated embeddings for ${results.length} blogs`,
      results
    });
  } catch (error) {
    console.error("Error generating all blog embeddings:", error);
    throw new Error("Failed to generate all blog embeddings");
  }
});

// API để tạo embedding cho một blog mới hoặc cập nhật
const generateSingleBlogEmbedding = asyncHandler(async (req, res) => {
  try {
    const { bid } = req.params;
    
    const Blog = require("../models/blog");
    const blog = await Blog.findById(bid);
    
    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog not found"
      });
    }
    
    const embeddingDoc = await generateBlogEmbedding(blog);
    
    res.json({
      success: true,
      message: `Generated embedding for blog: ${blog.title}`,
      embedding: embeddingDoc
    });
    
  } catch (error) {
    console.error("Error generating single blog embedding:", error);
    throw new Error("Failed to generate single blog embedding");
  }
});

// Lấy danh sách sản phẩm kèm trạng thái embedding
const getProductsWithEmbeddingStatus = asyncHandler(async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    
    // Lấy tất cả sản phẩm với phân trang
    const products = await Product.find({})
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .lean();
    
    const total = await Product.countDocuments({});
    
    // Lấy tất cả ID sản phẩm đã có embedding
    const existingEmbeddings = await Embedding.find({
      "metadata.sourceCollection": "Product"
    }, "metadata.sourceId");
    
    const existingIds = new Set(existingEmbeddings.map(e => 
      e.metadata.sourceId.toString()
    ));
    
    // Thêm trạng thái embedding vào mỗi sản phẩm
    const productsWithStatus = products.map(product => ({
      ...product,
      hasEmbedding: existingIds.has(product._id.toString())
    }));
    
    res.json({
      success: true,
      products: productsWithStatus,
      total
    });
  } catch (error) {
    console.error("Error fetching products with embedding status:", error);
    throw new Error("Failed to fetch products with embedding status");
  }
});

// Tạo embeddings chỉ cho các sản phẩm mới
const generateMissingEmbeddings = asyncHandler(async (req, res) => {
  try {
    // Lấy tất cả sản phẩm
    const products = await Product.find({});
    
    // Lấy tất cả ID sản phẩm đã có embedding
    const existingEmbeddings = await Embedding.find({
      "metadata.sourceCollection": "Product"
    }, "metadata.sourceId");
    
    const existingIds = new Set(existingEmbeddings.map(e => e.metadata.sourceId.toString()));
    
    // Lọc ra sản phẩm chưa có embedding
    const productsWithoutEmbeddings = products.filter(product => 
      !existingIds.has(product._id.toString())
    );
    
    // Tạo embeddings cho sản phẩm mới
    const results = [];
    for (const product of productsWithoutEmbeddings) {
      const embeddingDoc = await generateProductEmbedding(product);
      results.push({
        productId: product._id,
        productTitle: product.title,
        embeddingId: embeddingDoc._id
      });
    }
    
    res.json({
      success: true,
      message: `Generated embeddings for ${results.length} new products`,
      results
    });
  } catch (error) {
    console.error("Error generating missing embeddings:", error);
    throw new Error("Failed to generate missing embeddings");
  }
});

// Lấy thống kê về embeddings
const getEmbeddingStats = asyncHandler(async (req, res) => {
  try {
    // Đếm tổng số embeddings
    const totalEmbeddings = await Embedding.countDocuments({
      "metadata.sourceCollection": "Product"
    });
    
    // Đếm tổng số sản phẩm
    const totalProducts = await Product.countDocuments();
    
    // Lấy embedding mới nhất
    const latestEmbedding = await Embedding.findOne({
      "metadata.sourceCollection": "Product"
    }).sort({ updatedAt: -1 });
    
    res.json({
      success: true,
      stats: {
        totalEmbeddings,
        totalProducts,
        lastUpdated: latestEmbedding?.updatedAt || null,
        coverage: totalProducts > 0 ? (totalEmbeddings / totalProducts) * 100 : 0
      }
    });
  } catch (error) {
    console.error("Error fetching embedding stats:", error);
    throw new Error("Failed to fetch embedding stats");
  }
});

// Tạo embedding cho một coupon
const generateCouponEmbedding = asyncHandler(async (coupon) => {
  try {
    // Tạo nội dung từ coupon để embedding với nhiều từ khóa hơn
    const content = `
      Mã giảm giá: ${coupon.name}
      Coupon: ${coupon.name}
      Voucher: ${coupon.name}
      Mã khuyến mãi của cửa hàng Marseille: ${coupon.name}
      Ưu đãi từ Marseille: ${coupon.name}
      Code giảm giá: ${coupon.name}
      Giảm giá: ${coupon.discount}%
      Phần trăm giảm: ${coupon.discount}%
      Khuyến mãi: Giảm ${coupon.discount}% cho đơn hàng
      Hạn sử dụng: ${new Date(coupon.expiry).toLocaleDateString('vi-VN')}
      Có thể sử dụng tại cửa hàng Marseille
      Mã ưu đãi trong cửa hàng
      Mã khuyến mãi trong cửa hàng Marseille
    `;

    // Tạo embedding vector từ nội dung
    const embedding = await createEmbedding(content);

    // Lưu embedding vào database
    const embeddingDoc = await Embedding.findOneAndUpdate(
      { "metadata.sourceId": coupon._id },
      {
        content,
        metadata: {
          sourceId: coupon._id,
          sourceCollection: "Coupon",
          title: coupon.name,
          slug: coupon.name.toLowerCase().replace(/\s+/g, '-')
        },
        embedding
      },
      { upsert: true, new: true }
    );

    return embeddingDoc;
  } catch (error) {
    console.error("Error generating coupon embedding:", error);
    throw new Error("Failed to generate coupon embedding");
  }
});

// API để tạo embedding cho tất cả coupons
const generateAllCouponEmbeddings = asyncHandler(async (req, res) => {
  try {
    const Coupon = require("../models/coupon");
    const coupons = await Coupon.find({});
    
    const results = [];
    const errors = [];
    
    for (const coupon of coupons) {
      try {
        const embeddingDoc = await generateCouponEmbedding(coupon);
        results.push({
          couponId: coupon._id,
          couponName: coupon.name,
          embeddingId: embeddingDoc._id
        });
      } catch (err) {
        console.error(`Error generating embedding for coupon ${coupon._id} (${coupon.name}):`, err.message);
        errors.push({
          couponId: coupon._id,
          couponName: coupon.name,
          error: err.message
        });
      }
    }
    
    res.json({
      success: errors.length === 0,
      message: `Generated embeddings for ${results.length} coupons${errors.length > 0 ? ", but some failed" : ""}`,
      results,
      errors
    });
  } catch (error) {
    console.error("Error generating all coupon embeddings:", error);
    throw new Error("Failed to generate all coupon embeddings");
  }
});

// API để tạo embedding cho một coupon cụ thể
const generateSingleCouponEmbedding = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const Coupon = require("../models/coupon");
    const coupon = await Coupon.findById(id);
    
    if (!coupon) {
      return res.status(404).json({
        success: false,
        message: "Coupon không tồn tại"
      });
    }
    
    const embeddingDoc = await generateCouponEmbedding(coupon);
    
    res.json({
      success: true,
      message: "Generated embedding for coupon",
      embedding: embeddingDoc
    });
  } catch (error) {
    console.error("Error generating coupon embedding:", error);
    throw new Error("Failed to generate coupon embedding");
  }
});

module.exports = {
  generateAllProductEmbeddings,
  generateSingleProductEmbedding,
  generateProductEmbedding,
  generateBlogEmbedding,
  generateAllBlogEmbeddings,
  generateSingleBlogEmbedding,
  searchSimilarProducts,
  searchMultipleCollections,
  queryCollections,
  getProductsWithEmbeddingStatus,
  generateMissingEmbeddings,
  getEmbeddingStats,
  generateAllCouponEmbeddings,
  generateSingleCouponEmbedding
}; 