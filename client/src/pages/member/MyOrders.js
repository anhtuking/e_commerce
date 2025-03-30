import { useState, useEffect } from "react";
import { apiGetUserOrder } from "api/user";
import { formatPrice } from "utils/helpers";
import moment from "moment";

const statusClasses = {
  "Đã hủy": "bg-red-500",
  "Đang xử lý": "bg-amber-500",
  "Đã xác nhận": "bg-blue-500",
  "Hoàn thành": "bg-green-500",
};

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");
  const [expandedOrders, setExpandedOrders] = useState({});

  useEffect(() => {
    setLoading(true);
    apiGetUserOrder()
      .then((res) => {
        // Nếu res là một mảng, dùng nó trực tiếp. Nếu không, kiểm tra success.
        if (Array.isArray(res)) {
          setOrders(res);
        } else if (res.success) {
          setOrders(res.response || []);
        } else {
          setOrders([]);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("API error:", err);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (statusFilter === "all") {
      setFilteredOrders(orders);
    } else {
      setFilteredOrders(
        orders.filter((order) => order.status === statusFilter)
      );
    }
  }, [statusFilter, orders]);

  const toggleOrderDetails = (orderId) => {
    setExpandedOrders((prev) => ({
      ...prev,
      [orderId]: !prev[orderId],
    }));
  };

  const renderStatusBadge = (status) => {
    return (
      <span
        className={`${
          statusClasses[status] || "bg-gray-500"
        } text-white px-3 py-1 rounded-full text-sm font-medium inline-block`}
      >
        {status}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4">Đơn hàng của tôi</h1>
        <div className="animate-pulse flex space-x-4">
          <div className="flex-1 space-y-4 py-1">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <div className="mb-6 flex flex-wrap justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Đơn hàng của tôi</h1>
          <p className="text-gray-500 mt-1">
            {orders.length > 0
              ? `Bạn có ${orders.length} đơn hàng`
              : "Bạn chưa có đơn hàng nào"}
          </p>
        </div>

        {orders.length > 0 && (
          <div className="mt-4 md:mt-0">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="border rounded p-2 min-w-[180px] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">Tất cả đơn hàng</option>
              <option value="Đang xử lý">Đang xử lý</option>
              <option value="Đã xác nhận">Đã xác nhận</option>
              <option value="Hoàn thành">Hoàn thành</option>
              <option value="Đã hủy">Đã hủy</option>
            </select>
          </div>
        )}
      </div>

      {filteredOrders.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4 text-6xl">📦</div>
          <h3 className="text-lg font-medium">
            {statusFilter !== "all"
              ? "Không có đơn hàng nào với trạng thái đã chọn"
              : "Bạn chưa có đơn hàng nào"}
          </h3>
          <p className="text-gray-500 mt-1"></p>
        </div>
      ) : (
        <div className="space-y-6">
          {filteredOrders.map((order) => (
            <div
              key={order._id}
              className="border rounded-lg overflow-hidden shadow-sm bg-white"
            >
              {/* Order Header */}
              <div className="p-4 border-b">
                <div className="flex flex-wrap justify-between items-start">
                  <div>
                    <h3 className="font-bold text-lg">
                      Đơn hàng #{order.orderCode || order._id.substring(0, 8)}
                    </h3>
                    <p className="text-gray-500 text-sm">
                      Ngày đặt:{" "}
                      {moment(order.createdAt).format("DD/MM/YYYY HH:mm")}
                    </p>
                  </div>
                  <div className="mt-2 md:mt-0">
                    {renderStatusBadge(order.status)}
                  </div>
                </div>
              </div>

              {/* Order Summary */}
              <div className="p-4 bg-gray-50">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Tổng tiền</p>
                    <p className="text-lg font-bold">
                      {formatPrice(order.amount)} VND
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">
                      Phương thức thanh toán
                    </p>
                    <p>{order.typePayment || "VNPAY"}</p>
                  </div>
                </div>
              </div>

              {/* Toggle Details Button */}
              <button
                onClick={() => toggleOrderDetails(order._id)}
                className="w-full p-3 text-left border-t flex justify-between items-center hover:bg-gray-50 transition-colors"
              >
                <span className="font-medium">
                  {expandedOrders[order._id]
                    ? "Ẩn chi tiết"
                    : "Xem chi tiết đơn hàng"}
                </span>
                <span>{expandedOrders[order._id] ? "▲" : "▼"}</span>
              </button>

              {/* Order Details (Expandable) */}
              {expandedOrders[order._id] && (
                <div className="p-4 border-t">
                  {/* Products */}
                  <div className="mb-4">
                    <h4 className="font-medium mb-2">
                      Chi tiết sản phẩm ({order.products?.length || 0})
                    </h4>
                    {order.products && order.products.length > 0 ? (
                      <div className="space-y-4">
                        {order.products.map((item, index) => (
                          <div
                            key={index}
                            className="flex border-b pb-4 last:border-b-0 last:pb-0"
                          >
                            {item.thumbnail && (
                              <div className="w-16 h-16 rounded bg-gray-100 mr-4 overflow-hidden flex-shrink-0">
                                <img
                                  src={item.thumbnail || "/placeholder.svg"}
                                  alt={item.title}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            )}
                            <div className="flex-1">
                              <p className="font-medium">
                                {item.title || "Sản phẩm"}
                              </p>
                              {item.color && (
                                <p className="text-sm text-gray-500">
                                  Màu: {item.color}
                                </p>
                              )}
                              <div className="flex justify-between mt-1">
                                <p className="text-sm">SL: {item.quantity}</p>
                                <p className="font-medium">
                                  {formatPrice(item.price)} VND
                                </p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500 text-sm">
                        Không có thông tin sản phẩm
                      </p>
                    )}
                  </div>

                  {/* Shipping Info */}
                  <div className="mb-4">
                    <h4 className="font-medium mb-2">Thông tin giao hàng</h4>
                    <div className="space-y-2">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        <div>
                          <p className="text-sm text-gray-500">Email</p>
                          <p>{order.email}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Số điện thoại</p>
                          <p>{order.phone}</p>
                        </div>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">
                          Địa chỉ giao hàng
                        </p>
                        <p>{order.address}</p>
                      </div>
                    </div>
                  </div>

                  {/* Order Notes */}
                  {order.note && order.note.trim() !== "" && (
                    <div>
                      <h4 className="font-medium mb-2">Ghi chú đơn hàng</h4>
                      <p>{order.note}</p>
                    </div>
                  )}

                  {/* Transaction Info */}
                  <div className="mt-4 pt-4 border-t text-sm text-gray-500">
                    Mã giao dịch: {order.transactionCode}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyOrders;
