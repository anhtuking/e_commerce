import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Table, Button, Modal, Tag, Select, message } from 'antd';
import { EyeOutlined, CheckOutlined } from '@ant-design/icons';
import moment from 'moment';
import axios from 'axios';

const { Option } = Select;

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [detailVisible, setDetailVisible] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [statusLoading, setStatusLoading] = useState(false);
  
  // Get token from Redux store
  const { token } = useSelector(state => state.user);

  // Fetch all orders
  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/payment/orders', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      if (response.data.success) {
        setOrders(response.data.orders);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
      message.error('Không thể tải danh sách đơn hàng');
    } finally {
      setLoading(false);
    }
  };

  // Update order status
  const updateOrderStatus = async (orderId, status) => {
    try {
      setStatusLoading(true);
      const response = await axios.put(`/api/payment/orders/${orderId}`, 
        { status },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      
      if (response.data.success) {
        message.success('Cập nhật trạng thái đơn hàng thành công');
        fetchOrders();
        
        // Update selected order if modal is open
        if (selectedOrder && selectedOrder._id === orderId) {
          setSelectedOrder(response.data.order);
        }
      }
    } catch (error) {
      console.error('Error updating order status:', error);
      message.error('Không thể cập nhật trạng thái đơn hàng');
    } finally {
      setStatusLoading(false);
    }
  };

  // View order details
  const viewOrderDetails = async (orderId) => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/payment/orders/${orderId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      if (response.data.success) {
        setSelectedOrder(response.data.order);
        setDetailVisible(true);
      }
    } catch (error) {
      console.error('Error fetching order details:', error);
      message.error('Không thể tải chi tiết đơn hàng');
    } finally {
      setLoading(false);
    }
  };

  // Fetch orders on component mount
  useEffect(() => {
    fetchOrders();
  }, [token]);

  // Table columns
  const columns = [
    {
      title: 'Mã đơn hàng',
      dataIndex: 'orderCode',
      key: 'orderCode',
    },
    {
      title: 'Người đặt',
      dataIndex: 'user',
      key: 'user',
      render: (user) => user ? `${user.lastname} ${user.firstname}` : 'Unknown',
    },
    {
      title: 'Tổng tiền',
      dataIndex: 'totalPrice',
      key: 'totalPrice',
      render: (price) => `${price?.toLocaleString('vi-VN')} ₫`
    },
    {
      title: 'Phương thức',
      dataIndex: 'paymentMethod',
      key: 'paymentMethod',
    },
    {
      title: 'Trạng thái thanh toán',
      dataIndex: 'paymentStatus',
      key: 'paymentStatus',
      render: (status) => {
        let color = 'default';
        if (status === 'Đã thanh toán') color = 'green';
        else if (status === 'Đang xử lý thanh toán') color = 'blue';
        else if (status === 'Thanh toán thất bại') color = 'red';
        return <Tag color={color}>{status}</Tag>;
      }
    },
    {
      title: 'Trạng thái đơn hàng',
      dataIndex: 'status',
      key: 'status',
      render: (status) => {
        let color = 'default';
        if (status === 'Đã giao hàng') color = 'green';
        else if (status === 'Đang giao hàng') color = 'blue';
        else if (status === 'Đang xử lý') color = 'orange';
        else if (status === 'Đã hủy') color = 'red';
        return <Tag color={color}>{status}</Tag>;
      }
    },
    {
      title: 'Ngày đặt',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date) => moment(date).format('DD/MM/YYYY HH:mm')
    },
    {
      title: 'Thao tác',
      key: 'action',
      render: (_, record) => (
        <div className="flex gap-2">
          <Button 
            icon={<EyeOutlined />} 
            onClick={() => viewOrderDetails(record._id)}
          >
            Chi tiết
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Quản lý đơn hàng</h1>
      
      <Table 
        columns={columns} 
        dataSource={orders} 
        rowKey="_id" 
        loading={loading}
        pagination={{ pageSize: 10 }}
      />

      {/* Order Detail Modal */}
      <Modal
        title={`Chi tiết đơn hàng #${selectedOrder?.orderCode}`}
        open={detailVisible}
        onCancel={() => setDetailVisible(false)}
        footer={null}
        width={800}
      >
        {selectedOrder && (
          <div>
            <div className="mb-4">
              <h3 className="text-lg font-semibold">Thông tin khách hàng</h3>
              <p><strong>Họ tên:</strong> {selectedOrder.user?.lastname} {selectedOrder.user?.firstname}</p>
              <p><strong>Email:</strong> {selectedOrder.user?.email}</p>
              <p><strong>SĐT:</strong> {selectedOrder.user?.mobile}</p>
            </div>

            <div className="mb-4">
              <h3 className="text-lg font-semibold">Địa chỉ giao hàng</h3>
              <p>
                {selectedOrder.address?.street}, {selectedOrder.address?.ward}, {selectedOrder.address?.district}, {selectedOrder.address?.province}
              </p>
            </div>

            <div className="mb-4">
              <h3 className="text-lg font-semibold">Trạng thái đơn hàng</h3>
              <div className="flex items-center gap-4">
                <Tag color={
                  selectedOrder.status === 'Đã giao hàng' ? 'green' :
                  selectedOrder.status === 'Đang giao hàng' ? 'blue' :
                  selectedOrder.status === 'Đang xử lý' ? 'orange' :
                  selectedOrder.status === 'Đã hủy' ? 'red' : 'default'
                }>
                  {selectedOrder.status}
                </Tag>
                
                <Select
                  style={{ width: 200 }}
                  placeholder="Cập nhật trạng thái"
                  onChange={(value) => updateOrderStatus(selectedOrder._id, value)}
                  loading={statusLoading}
                >
                  <Option value="Đang xử lý">Đang xử lý</Option>
                  <Option value="Đang giao hàng">Đang giao hàng</Option>
                  <Option value="Đã giao hàng">Đã giao hàng</Option>
                  <Option value="Đã hủy">Đã hủy</Option>
                </Select>
              </div>
            </div>

            <div className="mb-4">
              <h3 className="text-lg font-semibold">Thông tin thanh toán</h3>
              <p><strong>Phương thức:</strong> {selectedOrder.paymentMethod}</p>
              <p><strong>Trạng thái:</strong> 
                <Tag className="ml-2" color={
                  selectedOrder.paymentStatus === 'Đã thanh toán' ? 'green' :
                  selectedOrder.paymentStatus === 'Đang xử lý thanh toán' ? 'blue' :
                  selectedOrder.paymentStatus === 'Thanh toán thất bại' ? 'red' : 'default'
                }>
                  {selectedOrder.paymentStatus}
                </Tag>
              </p>
              {selectedOrder.payment?.transactionId && (
                <p><strong>Mã giao dịch:</strong> {selectedOrder.payment.transactionId}</p>
              )}
              {selectedOrder.payment?.paymentDate && (
                <p><strong>Ngày thanh toán:</strong> {moment(selectedOrder.payment.paymentDate).format('DD/MM/YYYY HH:mm')}</p>
              )}
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">Sản phẩm</h3>
              <table className="min-w-full border">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border p-2">Sản phẩm</th>
                    <th className="border p-2">Màu sắc</th>
                    <th className="border p-2">Số lượng</th>
                    <th className="border p-2">Đơn giá</th>
                    <th className="border p-2">Thành tiền</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedOrder.products.map((item, index) => (
                    <tr key={index}>
                      <td className="border p-2">{item.product?.title || 'Sản phẩm không tồn tại'}</td>
                      <td className="border p-2">{item.color}</td>
                      <td className="border p-2">{item.quantity}</td>
                      <td className="border p-2">{item.price?.toLocaleString('vi-VN')} ₫</td>
                      <td className="border p-2">{(item.price * item.quantity)?.toLocaleString('vi-VN')} ₫</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="bg-gray-50">
                    <td colSpan="4" className="border p-2 text-right font-bold">Tổng cộng:</td>
                    <td className="border p-2 font-bold">{selectedOrder.totalPrice?.toLocaleString('vi-VN')} ₫</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Orders; 