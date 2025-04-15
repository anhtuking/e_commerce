import { useState, useEffect } from "react";
import { apiGetUserOrder } from "api/user";
import { formatPrice, createSlug } from "utils/helpers";
import moment from "moment";
import { FiPackage, FiCalendar, FiCreditCard, FiShoppingBag, FiTruck, FiMapPin, FiMail, FiPhone, FiFileText, FiStar } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import { statusConfig } from "utils/contants";
import { useNavigate } from "react-router-dom";

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");
  const [expandedOrders, setExpandedOrders] = useState({});
  const navigate = useNavigate();

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
    const config = statusConfig[status] || {
      color: "bg-gray-500",
      icon: null,
      lightBg: "bg-gray-50",
      border: "border-gray-200",
      text: "text-gray-700"
    };

    return (
      <span className={`${config.color} text-white px-3 py-1.5 rounded-full text-sm font-medium inline-flex items-center`}>
        {config.icon}
        {status}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="p-6 max-w-6xl mx-auto">
        <div className="flex items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Đơn hàng của tôi
            </span>
          </h1>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="animate-pulse space-y-6">
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            <div className="h-10 bg-gray-200 rounded w-1/5"></div>
            <div className="space-y-3">
              {[1, 2, 3].map(i => (
                <div key={i} className="border rounded-lg p-4">
                  <div className="flex justify-between">
                    <div className="h-5 bg-gray-200 rounded w-1/4"></div>
                    <div className="h-5 bg-gray-200 rounded w-1/6"></div>
                  </div>
                  <div className="h-4 bg-gray-200 rounded w-1/3 mt-2"></div>
                  <div className="h-20 bg-gray-100 rounded w-full mt-4"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 min-h-screen bg-gradient-to-b from-gray-50 to-white overflow-x-hidden">
      <div className="max-w-[1220px] mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div className="flex items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">
                <span className="bg-gradient-to-r from-red-600 to-red-800 bg-clip-text text-transparent">
                  Đơn hàng của tôi
                </span>
              </h1>
              <p className="text-gray-600">
                {orders.length > 0
                  ? `Bạn có ${orders.length} đơn hàng`
                  : "Bạn chưa có đơn hàng nào"}
              </p>
            </div>
          </div>

          {orders.length > 0 && (
            <div className="mt-4 md:mt-0">
              <div className="relative">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="appearance-none bg-white border border-gray-200 rounded-lg pl-4 pr-10 py-2.5 min-w-[220px] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm text-gray-700"
                >
                  <option value="all">Tất cả đơn hàng</option>
                  <option value="Đang xử lý">Đang xử lý</option>
                  <option value="Đã xác nhận">Đã xác nhận</option>
                  <option value="Hoàn thành">Hoàn thành</option>
                  <option value="Đã hủy">Đã hủy</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                  <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                    <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                  </svg>
                </div>
              </div>
            </div>
          )}
        </div>

        {filteredOrders.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
            <div className="flex justify-center mb-6">
              <div className="w-24 h-24 rounded-full bg-blue-50 flex items-center justify-center">
                <FiPackage className="text-blue-500 text-4xl" />
              </div>
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">
              {statusFilter !== "all"
                ? "Không có đơn hàng nào với trạng thái đã chọn"
                : "Bạn chưa có đơn hàng nào"}
            </h3>
            <p className="text-gray-500 max-w-md mx-auto">
              {statusFilter !== "all"
                ? "Hãy thử chọn một trạng thái khác hoặc xem tất cả đơn hàng"
                : "Khi bạn đặt hàng, chi tiết đơn hàng sẽ xuất hiện ở đây"}
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredOrders.map((order) => (
              <div
                key={order._id}
                className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden transition-all duration-300 hover:shadow-md"
              >
                {/* Order Header */}
                <div className="p-5 border-b border-gray-100">
                  <div className="flex flex-wrap justify-between items-center">
                    <div className="flex items-center space-x-3">
                      <div className={`${statusConfig[order.status]?.lightBg || "bg-gray-50"} p-2 rounded-lg ${statusConfig[order.status]?.border || "border-gray-100"} border`}>
                        <FiShoppingBag className={`text-xl ${statusConfig[order.status]?.text || "text-gray-700"}`} />
                      </div>
                      <div>
                        <h3 className="font-bold text-lg text-gray-800">
                          #{order.orderCode || order._id.substring(0, 8)}
                        </h3>
                        <div className="flex items-center text-gray-500 text-sm mt-1">
                          <FiCalendar className="mr-1" size={14} />
                          <span>{moment(order.createdAt).format("DD/MM/YYYY HH:mm")}</span>
                        </div>
                      </div>
                    </div>
                    <div className="mt-3 md:mt-0 flex items-center space-x-3">
                      <div className="hidden md:block">
                        <span className="text-gray-500 text-sm mr-2">Tổng:</span>
                        <span className="font-bold text-gray-800">{formatPrice(order.amount)} VND</span>
                      </div>
                      {renderStatusBadge(order.status)}
                    </div>
                  </div>
                </div>

                {/* Order Summary (Mobile) */}
                <div className="p-4 bg-gray-50 border-b border-gray-100 md:hidden">
                  <div className="flex justify-between items-center">
                    <div>
                      <span className="text-gray-500 text-sm">Tổng tiền:</span>
                      <div className="font-bold text-gray-800">{formatPrice(order.amount)} VND</div>
                    </div>
                    <div>
                      <span className="text-gray-500 text-sm">Thanh toán:</span>
                      <div className="font-medium">{order.typePayment || "VNPAY"}</div>
                    </div>
                  </div>
                </div>

                {/* Toggle Details Button */}
                <button
                  onClick={() => toggleOrderDetails(order._id)}
                  className="w-full p-4 text-left border-t flex justify-between items-center hover:bg-gray-50 transition-colors"
                >
                  <span className="font-medium flex items-center">
                    <FiFileText className="mr-2 text-blue-500" />
                    {expandedOrders[order._id]
                      ? "Ẩn chi tiết đơn hàng"
                      : "Xem chi tiết đơn hàng"}
                  </span>
                  <span className={`transition-transform duration-300 transform ${expandedOrders[order._id] ? "rotate-180" : ""}`}>
                    <svg width="12" height="7" viewBox="0 0 12 7" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M1 1L6 6L11 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                </button>

                {/* Order Details (Expandable) */}
                <AnimatePresence>
                  {expandedOrders[order._id] && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="p-5 border-t border-gray-100">
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                          {/* Left Column - Products */}
                          <div className="lg:col-span-2">
                            <h4 className="font-bold text-gray-800 mb-4 flex items-center">
                              <FiShoppingBag className="mr-2 text-blue-500" />
                              Chi tiết sản phẩm ({order.products?.length || 0})
                            </h4>
                            {order.products && order.products.length > 0 ? (
                              <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                                {order.products.map((item, index) => (
                                  <div
                                    key={index}
                                    className="flex border border-gray-100 rounded-lg p-3 hover:bg-gray-50 transition-colors"
                                  >
                                    {item.thumbnail && (
                                      <div className="w-16 h-16 rounded-lg bg-gray-100 mr-4 overflow-hidden flex-shrink-0 border border-gray-200">
                                        <img
                                          src={item.thumbnail || "/placeholder.svg"}
                                          alt={item.title}
                                          className="w-full h-full object-cover"
                                        />
                                      </div>
                                    )}
                                    <div className="flex-1 min-w-0">
                                      <p 
                                        className="font-medium text-gray-800 truncate hover:text-main cursor-pointer"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          const safeTitle = createSlug(item.title);
                                          navigate(`/${item.category?.toLowerCase() || 'san-pham'}/${item.pid || item._id}/${safeTitle}`);
                                        }}
                                      >
                                        {item.title || "Sản phẩm"}
                                      </p>
                                      <div className="flex flex-wrap gap-2 mt-1">
                                        {item.color && (
                                          <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                                            Màu: {item.color}
                                          </span>
                                        )}
                                        <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                                          SL: {item.quantity}
                                        </span>
                                      </div>
                                      <div className="mt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                                        <p className="font-bold text-gray-800">
                                          {formatPrice(item.price)} VND
                                        </p>
                                        {order.status === "Hoàn thành" && (
                                          <button 
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              const safeTitle = createSlug(item.title);
                                              navigate(`/${item.category?.toLowerCase() || 'san-pham'}/${item.pid || item._id}/${safeTitle}`);
                                            }}
                                            className="flex items-center justify-center gap-1 text-xs bg-main text-white px-3 py-1.5 rounded-md hover:bg-red-700 transition-colors"
                                          >
                                            <FiStar size={14} />
                                            Đánh giá sản phẩm
                                          </button>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <div className="text-gray-500 text-sm bg-gray-50 p-4 rounded-lg">
                                Không có thông tin sản phẩm
                              </div>
                            )}
                          </div>

                          {/* Right Column - Shipping & Payment */}
                          <div className="space-y-6">
                            {/* Payment Info */}
                            <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                              <h4 className="font-bold text-gray-800 mb-3 flex items-center">
                                <FiCreditCard className="mr-2 text-blue-500" />
                                Thông tin thanh toán
                              </h4>
                              <div className="space-y-3">
                                <div className="flex justify-between">
                                  <span className="text-gray-600">Phương thức:</span>
                                  <span className="font-medium">{order.typePayment || "VNPAY"}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-600">Tổng tiền:</span>
                                  <span className="font-bold">{formatPrice(order.amount)} VND</span>
                                </div>
                                <div className="pt-2 text-xs text-gray-500 border-t border-gray-200">
                                  Mã giao dịch: {order.transactionCode || "N/A"}
                                </div>
                              </div>
                            </div>

                            {/* Shipping Info */}
                            <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                              <h4 className="font-bold text-gray-800 mb-3 flex items-center">
                                <FiTruck className="mr-2 text-blue-500" />
                                Thông tin giao hàng
                              </h4>
                              <div className="space-y-3">
                                <div className="flex items-start">
                                  <FiMapPin className="text-gray-500 mt-0.5 mr-2 flex-shrink-0" />
                                  <div className="overflow-hidden">
                                    <span className="text-gray-600 text-sm">Địa chỉ:</span>
                                    <p className="font-medium break-words">{order.address}</p>
                                  </div>
                                </div>
                                <div className="flex items-start">
                                  <FiMail className="text-gray-500 mt-0.5 mr-2 flex-shrink-0" />
                                  <div className="overflow-hidden">
                                    <span className="text-gray-600 text-sm">Email:</span>
                                    <p className="font-medium break-words">{order.email}</p>
                                  </div>
                                </div>
                                <div className="flex items-start">
                                  <FiPhone className="text-gray-500 mt-0.5 mr-2 flex-shrink-0" />
                                  <div>
                                    <span className="text-gray-600 text-sm">Số điện thoại:</span>
                                    <p className="font-medium">{order.phone}</p>
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* Order Notes */}
                            {order.note && order.note.trim() !== "" && (
                              <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-100">
                                <h4 className="font-bold text-gray-800 mb-2 flex items-center">
                                  <FiFileText className="mr-2 text-yellow-500" />
                                  Ghi chú đơn hàng
                                </h4>
                                <p className="text-gray-700 break-words">{order.note}</p>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyOrders;
