const mongoose = require("mongoose"); // Erase if already required

// Declare the Schema of the Mongo model
var productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true, // auto delete space
    },
    // Điện thoại Ịphone => dien-thoai-iphone
    slug: {
      type: String,
      required: true,
      lowercase: true,
    },
    description: {
      type: Array,
      required: true,
    },
    infomations: {
      type: mongoose.Schema.Types.Mixed, 
      required: true
    },
    brand: {
      type: String,
      required: true,
    },
    thumb: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    quantity: {
      type: Number,
      default: 0,
    },
    sold: {
      type: Number,
      default: 0,
    },
    images: {
      type: Array,
    },
    color: {
      type: String,
      require: true,
    },
    ratings: [
      {
        star: {type: Number},
        comment: {type: String},
        postedBy: { type: mongoose.Types.ObjectId, ref: "User" },
        updatedAt: { type: Date }
      },
    ],
    totalRatings: {
      type: Number,
      default: 0,
    },
    variants: [
      {
        color: String,
        price: Number,
        thumb: String,
        sku: String
      }
    ]
  },
  {
    timestamps: true,
  }
);

//Export the model
module.exports = mongoose.model("Product", productSchema);
