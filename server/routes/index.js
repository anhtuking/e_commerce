const userRouter = require("./user");
const productRouter = require("./product");
const categoryRouter = require("./category");
const blogCategory = require("./blogCategory");
const blog = require("./blog");
const brand = require("./brand");
// const insert = require("./insert"); // Removed non-existent module
const coupon = require("./coupon");
const payment = require("./payment");
const admin = require("./admin");
const embeddingRouter = require("./embedding");
const chatRouter = require("./chat");
// const vectorStore = require("./vectorStore");
const { notFound, errorHandler } = require("../middlewares/errorHandler");

const initRoutes = (app) => {
  app.use("/api/user", userRouter);
  app.use("/api/product", productRouter);
  app.use("/api/category", categoryRouter);
  app.use("/api/blogCategory", blogCategory);
  app.use("/api/blog", blog);
  app.use("/api/brand", brand);
  app.use("/api/coupon", coupon);
  app.use("/api/payment", payment);
  app.use("/api/admin", admin);
  app.use("/api/embedding", embeddingRouter);
  app.use("/api/chat", chatRouter);
  // app.use("/api/vector", vectorStore);

  app.use(notFound);
  app.use(errorHandler);
};

module.exports = initRoutes;
