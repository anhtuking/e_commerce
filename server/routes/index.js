const userRouter = require("./user");
const productRouter = require("./product");
const categoryRouter = require("./category");
const blogRouter = require("./blogCategory");
const blog = require("./blog")
const { notFound, errorHandler } = require("../middlewares/errorHandler");

const initRoutes = (app) => {
  app.use("/api/user", userRouter);
  app.use("/api/product", productRouter);
  app.use("/api/category", categoryRouter);
  app.use("/api/blogCategory", blogRouter);
  app.use("/api/blog", blog);

  app.use(notFound);
  app.use(errorHandler);
};

module.exports = initRoutes;
