const userRouter = require("./user");
const productRouter = require("./product");
const categoryRouter = require("./category");
const blogCategory = require("./blogCategory");
const blog = require("./blog");
const brand = require("./brand");
const coupon = require("./coupon");
const order = require("./order");
const insert = require("./insert");
const payment = require("./payment");
const { notFound, errorHandler } = require("../middlewares/errorHandler");

const initRoutes = (app) => {
  app.use("/api/user", userRouter);
  app.use("/api/product", productRouter);
  app.use("/api/category", categoryRouter);
  app.use("/api/blogCategory", blogCategory);
  app.use("/api/blog", blog);
  app.use("/api/brand", brand);
  app.use("/api/coupon", coupon);
  app.use("/api/order", order);
  app.use("/api/insert", insert);
  app.use("/api/payment", payment);

  app.use(notFound);
  app.use(errorHandler);
};

module.exports = initRoutes;
