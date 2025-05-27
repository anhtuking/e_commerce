const { default: mongoose } = require("mongoose");
mongoose.set("strictQuery", false);
const dbConnect = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
  } catch (error) {
    throw new Error(error);
  }
};

module.exports = dbConnect;
