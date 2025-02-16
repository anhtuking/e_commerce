const mongoose = require("mongoose"); // Erase if already required

// Declare the Schema of the Mongo model
var orderSchema = new mongoose.Schema({
  products: [
    {
      product: { type: mongoose.Types.ObjectId, ref: "Product" },
      count: Number,
      color: String,
    },
  ],
  total: Number,
  coupon: {
    type: mongoose.Types.ObjectId,
    ref: 'Coupon'
  },
  orderBy: {
    type: mongoose.Types.ObjectId,
    ref: "User",
  },
  status: {
    type: String,
    default: "Processing",
    enum: ["Canceled", "Processing", "Successful"],
  },
});

//Export the model
module.exports = mongoose.model("Order", orderSchema);
