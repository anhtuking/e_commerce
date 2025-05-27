const mongoose = require("mongoose"); // Erase if already required

// Declare the Schema of the Mongo model
var couponSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      uppercase: true
    },
    discount: {
      type: Number,
      required: true,
    },
    expiry: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Check if the model exists before creating a new one
module.exports = mongoose.models.Coupon || mongoose.model("Coupon", couponSchema);
