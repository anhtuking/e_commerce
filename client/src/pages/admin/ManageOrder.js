import React, { useState, useEffect } from "react";
import { apiGetAllOrders } from "api/user";
import moment from "moment";
import withBase from "hocs/withBase";

const ManageOrder = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    setLoading(true);
    apiGetAllOrders()
      .then((res) => {
        // Giả sử API trả về dạng: { success: true, response: [...] }
        if (res && res.success) {
          setOrders(res.response);
        } else {
          setError("Không lấy được đơn hàng");
        }
        setLoading(false);
      })
      .catch((err) => {
        setError(err.response?.data?.message || err.message || "Lỗi hệ thống");
        setLoading(false);
      });
  }, []);

  // Lọc đơn hàng theo trạng thái
  const filteredOrders =
    statusFilter === "all"
      ? orders
      : orders.filter((order) => order.status === statusFilter);

  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold mb-4">Quản lý đơn hàng</h1>

      {loading && <p>Đang tải...</p>}
      {error && <p className="text-red-500">{error}</p>}

      <div className="mb-4">
        <label className="mr-2">Lọc theo trạng thái:</label>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border rounded p-2"
        >
          <option value="all">Tất cả</option>
          <option value="Đang xử lý">Đang xử lý</option>
          <option value="Đã xác nhận">Đã xác nhận</option>
          <option value="Hoàn thành">Hoàn thành</option>
          <option value="Đã hủy">Đã hủy</option>
        </select>
      </div>

      <table className="min-w-full border">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2">Mã đơn</th>
            <th className="border p-2">Email</th>
            <th className="border p-2">Tổng tiền</th>
            <th className="border p-2">Trạng thái</th>
            <th className="border p-2">Ngày tạo</th>
            <th className="border p-2">Hành động</th>
          </tr>
        </thead>
        <tbody>
          {filteredOrders.map((order) => (
            <tr key={order._id}>
              <td className="border p-2">
                {order.orderCode || order._id.substring(0, 8)}
              </td>
              <td className="border p-2">{order.email}</td>
              <td className="border p-2">{order.amount} VND</td>
              <td className="border p-2">{order.status}</td>
              <td className="border p-2">
                {moment(order.createdAt).format("DD/MM/YYYY HH:mm")}
              </td>
              <td className="border p-2">
                <button className="bg-blue-500 text-white p-2 rounded mr-2">
                  Xem chi tiết
                </button>
                <button className="bg-green-500 text-white p-2 rounded">
                  Cập nhật
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default withBase(ManageOrder);
