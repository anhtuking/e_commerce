const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    orderCode: {
      type: String,
      required: true
    },
    transactionCode: {
      type: String,
      required: true
    },
    products: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Product',
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
        },
        color: String,
        price: {
          type: Number,
          required: true,
        },
        title: String,
        thumbnail: String,
      },
    ],
    email: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      default: "Đang xử lý",
      enum: ["Đã hủy", "Đang xử lý", "Đã xác nhận", "Hoàn thành"],
    },
    amount: {
      type: Number,
      required: true,
    },
    typePayment: {
      type: String,
      enum: ['VNPAY'],
      default: 'VNPAY',
    },
    coupon: { type: String, default: null },
    paymentDate: {
      type: Date,
      default: Date.now,
    },
    note: {
      type: String,
      required: false // Không bắt buộc
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Order', orderSchema);