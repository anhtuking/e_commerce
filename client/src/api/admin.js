import axios from "../axios";
import { apiUrl, getConfig } from "../utils/helpers";

// Lấy dữ liệu thống kê mẫu
export const apiGetSampleStats = () =>
  axios({
    url: `${apiUrl}/admin/sample-stats`,
    method: 'get',
    withCredentials: true,
  });

// Lấy thống kê tổng quan
export const apiGetStatistics = () =>
  axios({
    url: `${apiUrl}/admin/statistics`,
    method: 'get',
    ...getConfig(),
  });

// Lấy doanh thu theo tháng và theo danh mục
export const apiGetRevenueStats = () =>
  axios({
    url: `${apiUrl}/admin/revenue-stats`,
    method: 'get',
    ...getConfig(),
  });

// Lấy top sản phẩm bán chạy
export const apiGetTopProducts = () =>
  axios({
    url: `${apiUrl}/admin/top-products`,
    method: 'get',
    ...getConfig(),
  });

// Lấy danh sách đơn hàng gần đây
export const apiGetRecentOrders = () =>
  axios({
    url: `${apiUrl}/admin/recent-orders`,
    method: 'get',
    ...getConfig(),
  });