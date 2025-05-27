const express = require("express")
require("dotenv").config()
const { initModels } = require("./models/index");
const initRoutes = require("./routes/index.js")
const cookieParser = require("cookie-parser")
const cors = require("cors")
const { dbConnect } = require('./config/cloudDB');
const { notFound, errorHandler } = require('./middlewares/errorHandler');

const app = express()
const port = process.env.PORT || 8888

// Middleware
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())
app.use(
  cors({
    origin: [process.env.CLIENT_URL, "http://192.168.0.138:3001", "http://localhost:3001"],
    methods: ["POST", "PUT", "GET", "DELETE"],
    credentials: true,
  }),
)

// Khởi tạo kết nối database và các models,
// sau đó khởi động server
const startServer = async () => {
  try {
    // Kết nối với MongoDB local trước
    await dbConnect();
    console.log("Connected to MongoDB local");
    
    // Sau đó khởi tạo models
    try {
      const modelsInitialized = await initModels();
      if (!modelsInitialized) {
        console.warn("Có lỗi khi khởi tạo models, nhưng server vẫn tiếp tục khởi động");
      } else {
        console.log("Database connections and models initialized successfully");
      }
    } catch (modelError) {
      console.error("Error initializing models:", modelError.message);
      console.warn("Server sẽ tiếp tục khởi động mà không có một số models...");
      // Tiếp tục chạy server ngay cả khi có lỗi model
    }
    
    // Khởi tạo routes sau khi models đã được khởi tạo
    initRoutes(app);
    
    // Error handling middleware
    app.use(notFound);
    app.use(errorHandler);
    
    // Khởi động server sau khi mọi thứ đã sẵn sàng
    const server = app.listen(port, () => {
      console.log("Server running on the port: " + port);
    }).on('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        console.log(`Port ${port} đã được sử dụng, thử port ${port + 1}`);
        app.listen(port + 1, () => {
          console.log("Server running on the port: " + (port + 1));
        });
      } else {
        console.error("Error starting server:", err);
      }
    });
  } catch (error) {
    console.error("Critical error starting server:", error);
    process.exit(1);
  }
};

// Bắt đầu khởi động server
startServer();

// Ghi log để kiểm tra trạng thái kết nối sau khi khởi động
process.on('SIGINT', async () => {
  console.log('Shutting down the server gracefully');
  process.exit(0);
});