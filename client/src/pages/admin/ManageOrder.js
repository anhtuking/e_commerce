import React, { useState, useEffect } from "react";
import { apiGetAllOrders, apiUpdateOrderStatus } from "api/user";
import moment from "moment";
import withBase from "hocs/withBase";
import { AiOutlineShoppingCart, AiOutlineSearch, AiOutlineEye, AiOutlineEdit, AiOutlineClose } from "react-icons/ai";
import { CgSpinner } from "react-icons/cg";
import { FiFilter } from "react-icons/fi";
import { BsClipboardCheck, BsCheck2Circle, BsXCircle, BsClock, BsInfoCircle } from "react-icons/bs";
import axios from "axios";
import { toast } from "react-toastify";

const ManageOrder = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [newStatus, setNewStatus] = useState("");

  const fetchOrders = () => {
    setLoading(true);
    apiGetAllOrders()
      .then((res) => {
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
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // Filter orders by status and search term
  const filteredOrders = orders
    .filter(order => statusFilter === "all" || order.status === statusFilter)
    .filter(order => {
      if (!searchTerm) return true;
      const searchLower = searchTerm.toLowerCase();
      return (
        (order.orderCode && order.orderCode.toLowerCase().includes(searchLower)) ||
        (order._id && order._id.toLowerCase().includes(searchLower)) ||
        (order.email && order.email.toLowerCase().includes(searchLower))
      );
    });

  // Get status icon and color
  const getStatusInfo = (status) => {
    switch (status) {
      case 'Đang xử lý':
        return { icon: <BsClock className="mr-2" />, bgColor: 'bg-amber-100', textColor: 'text-amber-700' };
      case 'Đã xác nhận':
        return { icon: <BsClipboardCheck className="mr-2" />, bgColor: 'bg-blue-100', textColor: 'text-blue-700' };
      case 'Hoàn thành':
        return { icon: <BsCheck2Circle className="mr-2" />, bgColor: 'bg-green-100', textColor: 'text-green-700' };
      case 'Đã hủy':
        return { icon: <BsXCircle className="mr-2" />, bgColor: 'bg-red-100', textColor: 'text-red-700' };
      default:
        return { icon: <BsClock className="mr-2" />, bgColor: 'bg-gray-100', textColor: 'text-gray-700' };
    }
  };

  // Handle viewing order details
  const handleViewDetails = (order) => {
    setSelectedOrder(order);
    setShowDetailsModal(true);
  };

  // Handle editing order status
  const handleEditStatus = (order) => {
    setSelectedOrder(order);
    setNewStatus(order.status);
    setShowEditModal(true);
  };

  // Update order status
  const updateOrderStatus = async () => {
    if (!selectedOrder || !newStatus) return;
    
    setUpdatingStatus(true);
    try {
      const response = await apiUpdateOrderStatus({
        orderId: selectedOrder._id,
        status: newStatus
      });
      
      if (response.success) {
        setOrders(prevOrders => 
          prevOrders.map(order => 
            order._id === selectedOrder._id 
              ? { ...order, status: newStatus } 
              : order
          )
        );
        setShowEditModal(false);
        toast.success("Cập nhật trạng thái đơn hàng thành công");
        fetchOrders();
      } else {
        toast.error(response.message || "Cập nhật không thành công");
      }
    } catch (error) {
      console.error("Update order status error:", error);
      toast.error("Có lỗi xảy ra khi cập nhật trạng thái đơn hàng");
    } finally {
      setUpdatingStatus(false);
    }
  };
  

  // Format price
  const formatPrice = (price) => {
    return Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center mb-2">
          <div className="p-3 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl mr-4 shadow-lg">
            <AiOutlineShoppingCart className="text-white text-2xl" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Manage Orders</h1>
            <p className="text-gray-500">Manage and track customer orders</p>
          </div>
        </div>
        <div className="h-1 w-20 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full"></div>
      </div>

      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <div className="mb-4 md:mb-0">
          <p className="text-gray-500 text-sm">
            <span className="font-medium text-indigo-600">{filteredOrders.length}</span> orders found
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search bar */}
          <div className="relative">
            <input
              type="text"
              placeholder="Tìm kiếm theo mã đơn, email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 w-full sm:w-64 transition-all outline-none"
            />
            <AiOutlineSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg" />
          </div>

          {/* Filter dropdown */}
          <div className="relative flex items-center">
            <FiFilter className="absolute left-3 text-gray-500" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="pl-9 pr-4 py-2 border border-gray-300 rounded-lg appearance-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 bg-white w-full transition-all outline-none cursor-pointer"
            >
              <option value="all">Tất cả đơn hàng</option>
              <option value="Đang xử lý">Đang xử lý</option>
              <option value="Đã xác nhận">Đã xác nhận</option>
              <option value="Hoàn thành">Hoàn thành</option>
              <option value="Đã hủy">Đã hủy</option>
            </select>
          </div>
        </div>
      </div>

      {/* Loading and error states */}
      {loading && (
        <div className="flex items-center justify-center p-12">
          <CgSpinner className="animate-spin text-4xl text-indigo-600 mr-3" />
          <p className="text-gray-600 font-medium">Đang tải dữ liệu...</p>
        </div>
      )}

      {error && (
        <div className="bg-red-50 p-4 rounded-lg border border-red-200 mb-6">
          <p className="text-red-600 font-medium flex items-center">
            <BsXCircle className="mr-2" /> {error}
          </p>
        </div>
      )}

      {/* Orders table */}
      {!loading && !error && (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Mã đơn
                  </th>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Khách hàng
                  </th>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tổng tiền
                  </th>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Trạng thái
                  </th>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ngày tạo
                  </th>
                  <th scope="col" className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Hành động
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredOrders.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-12 text-center text-gray-500">
                      <div className="flex flex-col items-center">
                        <AiOutlineShoppingCart className="text-4xl text-gray-300 mb-3" />
                        <p className="text-lg font-medium mb-1">Không tìm thấy đơn hàng nào</p>
                        <p className="text-sm">Vui lòng thử lại với bộ lọc khác</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredOrders.map((order) => {
                    const statusInfo = getStatusInfo(order.status);
                    return (
                      <tr key={order._id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="font-medium text-gray-900">
                            {order.orderCode || order._id.substring(0, 8)}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-gray-700">
                          {order.userInfo ? `${order.userInfo.firstname} ${order.userInfo.lastname}` : order.email}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="font-semibold text-gray-900">
                            {formatPrice(order.amount)}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${statusInfo.bgColor} ${statusInfo.textColor}`}>
                            {statusInfo.icon}
                            {order.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-gray-700">
                          {moment(order.createdAt).format("DD/MM/YYYY HH:mm")}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button 
                            onClick={() => handleViewDetails(order)}
                            className="bg-indigo-50 text-indigo-600 hover:bg-indigo-100 p-2 rounded-lg mr-2 transition-colors"
                            title="Xem chi tiết"
                          >
                            <AiOutlineEye className="text-xl" />
                          </button>
                          <button 
                            onClick={() => handleEditStatus(order)}
                            className="bg-emerald-50 text-emerald-600 hover:bg-emerald-100 p-2 rounded-lg transition-colors"
                            title="Cập nhật trạng thái"
                          >
                            <AiOutlineEdit className="text-xl" />
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Order Details Modal */}
      {showDetailsModal && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Chi tiết đơn hàng</h2>
                <button
                  onClick={() => setShowDetailsModal(false)}
                  className="text-gray-500 hover:text-gray-700 transition-colors"
                >
                  <AiOutlineClose className="text-2xl" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <h3 className="text-lg font-semibold mb-3 text-gray-700">Thông tin đơn hàng</h3>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="mb-2">
                      <span className="font-medium">Mã đơn hàng:</span>{" "}
                      <span>{selectedOrder.orderCode || selectedOrder._id}</span>
                    </div>
                    <div className="mb-2">
                      <span className="font-medium">Ngày đặt:</span>{" "}
                      <span>{moment(selectedOrder.createdAt).format("DD/MM/YYYY HH:mm")}</span>
                    </div>
                    <div className="mb-2">
                      <span className="font-medium">Trạng thái:</span>{" "}
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusInfo(selectedOrder.status).bgColor} ${getStatusInfo(selectedOrder.status).textColor}`}>
                        {getStatusInfo(selectedOrder.status).icon}
                        {selectedOrder.status}
                      </span>
                    </div>
                    <div className="mb-2">
                      <span className="font-medium">Tổng tiền:</span>{" "}
                      <span className="font-semibold">{formatPrice(selectedOrder.amount)}</span>
                    </div>
                    <div className="mb-2">
                      <span className="font-medium">Phương thức thanh toán:</span>{" "}
                      <span>{selectedOrder.typePayment || "COD"}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-3 text-gray-700">Thông tin khách hàng</h3>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="mb-2">
                      <span className="font-medium">Tên:</span>{" "}
                      <span>{selectedOrder.userInfo ? `${selectedOrder.userInfo.firstname} ${selectedOrder.userInfo.lastname}` : "N/A"}</span>
                    </div>
                    <div className="mb-2">
                      <span className="font-medium">Email:</span>{" "}
                      <span>{selectedOrder.email}</span>
                    </div>
                    <div className="mb-2">
                      <span className="font-medium">Số điện thoại:</span>{" "}
                      <span>{selectedOrder.mobile || selectedOrder.userInfo?.mobile || "N/A"}</span>
                    </div>
                    <div className="mb-2">
                      <span className="font-medium">Địa chỉ:</span>{" "}
                      <span>{selectedOrder.address || selectedOrder.userInfo?.address || "N/A"}</span>
                    </div>
                  </div>
                </div>
              </div>

              <h3 className="text-lg font-semibold mb-3 text-gray-700">Sản phẩm đã đặt</h3>
              <div className="bg-gray-50 rounded-lg overflow-hidden mb-6">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-100">
                    <tr>
                      <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Sản phẩm</th>
                      <th scope="col" className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Số lượng</th>
                      <th scope="col" className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Đơn giá</th>
                      <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Thành tiền</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {selectedOrder.products && selectedOrder.products.map((item, index) => (
                      <tr key={index}>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="flex items-center">
                            {item.thumb && (
                              <img 
                                src={item.thumb} 
                                alt={item.name || item.title} 
                                className="h-10 w-10 rounded-md object-cover mr-3"
                              />
                            )}
                            <div>
                              <div className="font-medium text-gray-900">{item.name || item.title}</div>
                              {item.color && <div className="text-xs text-gray-500">Color: {item.color}</div>}
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-center text-gray-700">
                          {item.quantity}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-center text-gray-700">
                          {formatPrice(item.price)}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-right font-medium text-gray-900">
                          {formatPrice(item.price * item.quantity)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="bg-gray-50">
                    <tr>
                      <td colSpan="3" className="px-4 py-3 text-right font-medium">Tổng cộng:</td>
                      <td className="px-4 py-3 text-right font-bold text-gray-900">{formatPrice(selectedOrder.amount)}</td>
                    </tr>
                  </tfoot>
                </table>
              </div>

              <div className="flex justify-end">
                <button
                  onClick={() => setShowDetailsModal(false)}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded transition-colors"
                >
                  Đóng
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Status Modal */}
      {showEditModal && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-lg w-full">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-800">Cập nhật trạng thái đơn hàng</h2>
                <button
                  onClick={() => setShowEditModal(false)}
                  className="text-gray-500 hover:text-gray-700 transition-colors"
                >
                  <AiOutlineClose className="text-2xl" />
                </button>
              </div>

              <div className="mb-6">
                <div className="flex items-center mb-4">
                  <BsInfoCircle className="text-blue-500 mr-2" />
                  <span className="font-medium">Mã đơn hàng: {selectedOrder.orderCode || selectedOrder._id.substring(0, 8)}</span>
                </div>

                <label className="block text-gray-700 font-medium mb-2">Chọn trạng thái mới</label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 transition-all outline-none"
                >
                  <option value="Đang xử lý">Đang xử lý</option>
                  <option value="Đã xác nhận">Đã xác nhận</option>
                  <option value="Hoàn thành">Hoàn thành</option>
                  <option value="Đã hủy">Đã hủy</option>
                </select>
              </div>

              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setShowEditModal(false)}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded transition-colors"
                >
                  Hủy
                </button>
                <button
                  onClick={updateOrderStatus}
                  disabled={updatingStatus || newStatus === selectedOrder.status}
                  className={`bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-2 px-4 rounded transition-colors flex items-center ${
                    (updatingStatus || newStatus === selectedOrder.status) ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  {updatingStatus && <CgSpinner className="animate-spin mr-2" />}
                  Cập nhật
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default withBase(ManageOrder);