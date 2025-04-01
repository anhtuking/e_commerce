import axios from "../axios";
// import { getConfig } from "utils/helpers";

// Lấy dữ liệu thống kê mẫu
export const apiGetSampleStats = () =>
  axios({
    url: `/admin/sample-stats`,
    method: 'get',
    withCredentials: true,
  });

// Lấy thống kê tổng quan
export const apiGetStatistics = (token) =>
  axios({
    url: `/admin/statistics`,
    method: 'get',
    token
  });

// Lấy doanh thu theo tháng và theo danh mục
export const apiGetRevenueStats = () =>
  axios({
    url: `/admin/revenue-stats`,
    method: 'get',
  });

// Lấy top sản phẩm bán chạy
export const apiGetTopProducts = () =>
  axios({
    url: `/admin/top-products`,
    method: 'get',
  });

// Lấy danh sách đơn hàng gần đây
export const apiGetRecentOrders = () =>
  axios({
    url: `/admin/recent-orders`,
    method: 'get',
  });