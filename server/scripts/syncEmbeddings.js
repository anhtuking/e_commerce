require('dotenv').config();
const mongoose = require('mongoose');
const { dbConnect } = require('../config/cloudDB');
const Product = require('../models/product');
const Blog = require('../models/blog');
const Coupon = require('../models/coupon');
const { createEmbedding, saveEmbedding } = require('../ultils/embedding');

const syncEmbeddings = async () => {
  try {
    console.log('Connecting to database...');
    await dbConnect();
    
    // Đồng bộ Products
    console.log('Syncing product embeddings...');
    const products = await Product.find({});
    console.log(`Found ${products.length} products to sync`);
    
    let syncedCount = 0;
    for (const product of products) {
      try {
        // Tạo nội dung từ product
        const content = `
          Tên sản phẩm: ${product.title}
          Danh mục: ${product.category}
          Thương hiệu: ${product.brand}
          Giá: ${product.price}
          Hình ảnh: ${product.thumb || ""}
          Số lượng tồn kho: ${product.quantity || 0}
          Đã bán: ${product.sold || 0}
          Đánh giá trung bình: ${product.totalRatings || 0}
          Biến thể sản phẩm: ${product.variants ? JSON.stringify(product.variants) : "Không có"}
          Mô tả: ${product.description && product.description.length > 0 ? (Array.isArray(product.description) ? product.description.join(" ") : product.description) : ""}
        `;

        // Tạo embedding
        const embedding = await createEmbedding(content);
        
        // Chuẩn bị metadata - chỉ định rõ loại collection
        const metadata = {
          sourceId: product._id,
          sourceCollection: "Product",  // Quan trọng: chỉ định loại dữ liệu
          title: product.title,
          slug: product.slug,
          category: product.category,
          brand: product.brand,
          price: product.price,
          quantity: product.quantity,
          sold: product.sold,
          totalRatings: product.totalRatings,
          hasVariants: product.variants && product.variants.length > 0
        };
        
        // Lưu vào database với loại dữ liệu Product
        await saveEmbedding(content, metadata, embedding);
        
        syncedCount++;
        if (syncedCount % 10 === 0) {
          console.log(`Synced ${syncedCount}/${products.length} products`);
        }
      } catch (error) {
        console.error(`Error syncing product ${product._id} (${product.title}):`, error.message);
      }
    }
    
    // Sync Blogs
    console.log('Syncing blog embeddings...');
    const blogs = await Blog.find({});
    console.log(`Found ${blogs.length} blogs to sync`);
    
    syncedCount = 0;
    for (const blog of blogs) {
      try {
        // Tạo nội dung từ blog
        const content = `
          Tiêu đề: ${blog.title}
          Mô tả: ${blog.description || ""}
          Nội dung: ${blog.content || ""}
          Tags: ${blog.tags?.join(", ") || ""}
          Tác giả: ${blog.author || ""}
        `;

        // Tạo embedding
        const embedding = await createEmbedding(content);
        
        // Chuẩn bị metadata - chỉ định rõ loại collection
        const metadata = {
          sourceId: blog._id,
          sourceCollection: "Blog",  // Quan trọng: chỉ định loại dữ liệu
          title: blog.title,
          slug: blog.slug,
          tags: blog.tags,
          author: blog.author
        };
        
        // Lưu vào database với loại dữ liệu Blog
        await saveEmbedding(content, metadata, embedding);
        
        syncedCount++;
        if (syncedCount % 10 === 0) {
          console.log(`Synced ${syncedCount}/${blogs.length} blogs`);
        }
      } catch (error) {
        console.error(`Error syncing blog ${blog._id} (${blog.title}):`, error.message);
      }
    }
    
    // Sync Coupons
    console.log('Syncing coupon embeddings...');
    const coupons = await Coupon.find({});
    console.log(`Found ${coupons.length} coupons to sync`);
    
    syncedCount = 0;
    for (const coupon of coupons) {
      try {
        // Tạo nội dung từ coupon
        const content = `
          Code: ${coupon.code}
          Giảm giá: ${coupon.discount}${coupon.discountType === 'percent' ? '%' : 'đ'}
          Mô tả: ${coupon.description || ""}
          Ngày hết hạn: ${coupon.expiry || ""}
        `;

        // Tạo embedding
        const embedding = await createEmbedding(content);
        
        // Chuẩn bị metadata - chỉ định rõ loại collection
        const metadata = {
          sourceId: coupon._id,
          sourceCollection: "Coupon",  // Quan trọng: chỉ định loại dữ liệu
          title: coupon.code
        };
        
        // Lưu vào database với loại dữ liệu Coupon
        await saveEmbedding(content, metadata, embedding);
        
        syncedCount++;
        if (syncedCount % 10 === 0) {
          console.log(`Synced ${syncedCount}/${coupons.length} coupons`);
        }
      } catch (error) {
        console.error(`Error syncing coupon ${coupon._id} (${coupon.code}):`, error.message);
      }
    }
    
    console.log('Embedding sync complete!');
    mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('Error syncing embeddings:', error);
    mongoose.disconnect();
    process.exit(1);
  }
};

syncEmbeddings();