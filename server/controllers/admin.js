const asyncHandler = require("express-async-handler");
const mongoose = require("mongoose");
const Order = require("../models/order");
const User = require("../models/user");

/**
 * Lấy thống kê tổng quan:
 * - Tổng doanh thu: tổng giá trị của các đơn hàng có trạng thái Delivered.
 * - Tổng đơn hàng.
 * - Tổng khách hàng (role = 'user').
 */
const getStatistics = asyncHandler(async (req, res) => {
  // Tổng doanh thu: chỉ tính các đơn hàng đã Delivered
  const revenueAgg = await Order.aggregate([
    { $match: { status: 'Delivered' } },
    { $group: { _id: null, total: { $sum: '$totalPrice' } } }
  ]);
  const totalRevenue = revenueAgg.length > 0 ? revenueAgg[0].total : 0;

  // Tổng đơn hàng
  const totalOrders = await Order.countDocuments();

  // Tổng khách hàng (chỉ đếm những user có role là 'user')
  const totalCustomers = await User.countDocuments({ role: 'user' });

  return res.status(200).json({
    success: true,
    totalRevenue,
    totalOrders,
    totalCustomers,
  });
});

/**
 * Lấy doanh thu theo tháng và doanh thu theo danh mục cho năm hiện tại.
 */
const getRevenueStats = asyncHandler(async (req, res) => {
  const currentYear = new Date().getFullYear();

  // Doanh thu theo tháng (chỉ tính đơn hàng Delivered)
  const monthlyRevenueAgg = await Order.aggregate([
    {
      $match: {
        status: 'Delivered',
        createdAt: {
          $gte: new Date(currentYear, 0, 1),
          $lte: new Date(currentYear, 11, 31)
        }
      }
    },
    {
      $group: {
        _id: { $month: '$createdAt' },
        total: { $sum: '$totalPrice' }
      }
    },
    { $sort: { _id: 1 } }
  ]);

  // Khởi tạo mảng doanh thu cho 12 tháng
  const months = Array(12).fill(0);
  monthlyRevenueAgg.forEach(item => {
    // Ví dụ: đổi sang triệu đồng
    months[item._id - 1] = Math.round(item.total / 1000000);
  });

  // Doanh thu theo danh mục: Giả sử mỗi đơn hàng chứa mảng sản phẩm và mỗi sản phẩm có trường category
  // Nếu trong Order không có trực tiếp category, bạn cần thực hiện lookup hoặc điều chỉnh theo mô hình của bạn.
  const categoryRevenueAgg = await Order.aggregate([
    { $match: { status: 'Delivered' } },
    { $unwind: '$products' },
    {
      $group: {
        _id: '$products.category', // Giả sử products có trường category (có thể là ObjectId hoặc string)
        total: { $sum: { $multiply: ['$products.quantity', '$products.price'] } }
      }
    },
    { $sort: { total: -1 } },
    { $limit: 5 }
  ]);

  const categoryLabels = categoryRevenueAgg.map(item => item._id);
  const categoryValues = categoryRevenueAgg.map(item => Math.round(item.total / 1000000));

  return res.status(200).json({
    success: true,
    revenueData: {
      labels: ['T1', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'T8', 'T9', 'T10', 'T11', 'T12'],
      datasets: [
        {
          label: 'Doanh thu (triệu đồng)',
          data: months,
          backgroundColor: 'rgba(54, 162, 235, 0.5)',
          borderColor: 'rgba(54, 162, 235, 1)',
          borderWidth: 1,
        },
      ],
    },
    categoryData: {
      labels: categoryLabels,
      datasets: [
        {
          label: 'Doanh thu theo danh mục (triệu đồng)',
          data: categoryValues,
          backgroundColor: [
            'rgba(255, 99, 132, 0.5)',
            'rgba(54, 162, 235, 0.5)',
            'rgba(255, 206, 86, 0.5)',
            'rgba(75, 192, 192, 0.5)',
            'rgba(153, 102, 255, 0.5)',
          ],
          borderColor: [
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)',
          ],
          borderWidth: 1,
        },
      ],
    }
  });
});

/**
 * Lấy danh sách top sản phẩm bán chạy
 */
const getTopProducts = asyncHandler(async (req, res) => {
  // Giả sử mỗi đơn hàng có mảng sản phẩm, mỗi sản phẩm chứa product id và quantity
  const topProductsAgg = await Order.aggregate([
    { $match: { status: 'Delivered' } },
    { $unwind: '$products' },
    {
      $group: {
        _id: '$products.product', // Sản phẩm được tham chiếu qua id
        totalSold: { $sum: '$products.quantity' }
      }
    },
    { $sort: { totalSold: -1 } },
    { $limit: 5 },
    // Nếu muốn lấy thông tin sản phẩm, có thể dùng lookup sau này.
  ]);

  return res.status(200).json({
    success: true,
    data: topProductsAgg,
  });
});

/**
 * Lấy danh sách 10 đơn hàng gần đây
 */
const getRecentOrders = asyncHandler(async (req, res) => {
  const recentOrders = await Order.find()
    .sort({ createdAt: -1 })
    .limit(10)
    // Nếu đơn hàng lưu thông tin người đặt (ví dụ: orderBy) thì populate thông tin đó
    .populate('orderBy', 'firstname lastname');
    
  // Format lại dữ liệu cho phù hợp (tùy theo yêu cầu UI)
  const formattedOrders = recentOrders.map(order => ({
    id: order._id,
    customer: order.orderBy ? `${order.orderBy.firstname} ${order.orderBy.lastname}` : order.email,
    date: order.createdAt.toLocaleDateString('vi-VN'),
    amount: order.totalPrice, // Giả sử order có trường totalPrice
    status: order.status
  }));

  return res.status(200).json({
    success: true,
    data: formattedOrders,
  });
});

const getSampleStats = asyncHandler(async (req, res) => {
  // Nếu muốn giữ endpoint sample, bạn có thể trả về dữ liệu mẫu ở đây
  return res.status(200).json({
    success: true,
    sample: true,
  });
});

module.exports = {
  getSampleStats,
  getStatistics,
  getRevenueStats,
  getTopProducts,
  getRecentOrders,
};