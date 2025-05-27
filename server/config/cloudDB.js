// server/config/database.js
const mongoose = require('mongoose');

// Kết nối với MongoDB local
const dbConnect = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 60000,
      socketTimeoutMS: 90000,
      connectTimeoutMS: 60000,
      family: 4,
      retryWrites: true,
      retryReads: true,
      maxPoolSize: 10,
      minPoolSize: 5
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

// Kết nối Atlas - placeholder function
const getAtlasConnection = async () => {
    try {
      // Kiểm tra có biến môi trường không
      if (!process.env.MONGODB_ATLAS_URI) {
      console.log("MONGODB_ATLAS_URI không được thiết lập, bỏ qua kết nối Atlas");
        return null;
      }
      
    console.log("Atlas connection is disabled in this version");
    return null;
    } catch (error) {
    console.error("Lỗi khi tạo kết nối Atlas:", error.message);
      return null;
    }
  };

module.exports = {
  dbConnect,
  getAtlasConnection
};