import React, { useEffect, useState } from 'react';
import { Bar, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend } from 'chart.js';
import { Card, Row, Col, Table, Typography, Statistic, Divider, List, Avatar, Spin, notification } from 'antd';
import { DollarOutlined, ShoppingOutlined, UserOutlined, ArrowUpOutlined } from '@ant-design/icons';
import axios from 'axios';
import { apiUrl, getConfig, formatPrice, formatOrderStatus } from '../../utils/helpers'; // formatOrderStatus có thể chuyển trạng thái sang tiếng Việt

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend);

const { Title: AntTitle } = Typography;

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [statsData, setStatsData] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    totalCustomers: 0,
  });
  const [revenueData, setRevenueData] = useState({
    labels: Array.from({length: 12}, (_, i) => `T${i + 1}`),
    datasets: [
      {
        label: 'Doanh thu (triệu đồng)',
        data: Array(12).fill(0),
        backgroundColor: 'rgba(54, 162, 235, 0.5)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1,
      },
    ],
  });
  const [categoryData, setCategoryData] = useState({
    labels: [],
    datasets: [
      {
        label: 'Doanh thu theo danh mục (triệu đồng)',
        data: [],
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
  });
  const [topProducts, setTopProducts] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const config = getConfig(); // Lấy config có token và header
        config.withCredentials = true;
        
        // Lấy thống kê tổng quan
        const statsRes = await axios.get(`${apiUrl}/admin/statistics`, config);
        if (statsRes.data.success) {
          setStatsData({
            totalRevenue: statsRes.data.totalRevenue,
            totalOrders: statsRes.data.totalOrders,
            totalCustomers: statsRes.data.totalCustomers,
          });
        }

        // Lấy dữ liệu doanh thu theo tháng và doanh thu theo danh mục
        const revenueRes = await axios.get(`${apiUrl}/admin/revenue-stats`, config);
        if (revenueRes.data.success) {
          setRevenueData(revenueRes.data.revenueData);
          setCategoryData(revenueRes.data.categoryData);
        }

        // Lấy top sản phẩm bán chạy
        const topProductsRes = await axios.get(`${apiUrl}/admin/top-products`, config);
        if (topProductsRes.data.success) {
          setTopProducts(topProductsRes.data.data);
        }

        // Lấy danh sách đơn hàng gần đây
        const recentOrdersRes = await axios.get(`${apiUrl}/admin/recent-orders`, config);
        if (recentOrdersRes.data.success) {
          setRecentOrders(recentOrdersRes.data.data);
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        notification.error({
          message: 'Lỗi',
          description: 'Không thể tải dữ liệu thống kê từ server.',
          duration: 5,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Format tiền hiển thị
  const formatCurrency = (value) => formatPrice(value);

  const stats = [
    { 
      title: 'Tổng doanh thu', 
      value: formatCurrency(statsData.totalRevenue), 
      icon: <DollarOutlined />, 
      color: '#1890ff' 
    },
    { 
      title: 'Tổng đơn hàng', 
      value: statsData.totalOrders, 
      icon: <ShoppingOutlined />, 
      color: '#52c41a' 
    },
    { 
      title: 'Tổng khách hàng', 
      value: statsData.totalCustomers, 
      icon: <UserOutlined />, 
      color: '#722ed1' 
    },
  ];

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'top' },
      title: { display: true, text: 'Doanh thu theo tháng (theo DB)' },
    },
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 'calc(100vh - 64px)' }}>
        <Spin size="large" tip="Đang tải dữ liệu thống kê..." />
      </div>
    );
  }

  return (
    <div className="dashboard-container w-[1555px]" style={{ padding: '20px' }}>
      <AntTitle level={2}>Dashboard</AntTitle>
      
      {/* Thống kê tổng quan */}
      <Row gutter={[16, 16]}>
        {stats.map((stat, index) => (
          <Col span={8} key={index}>
            <Card>
              <Statistic
                title={stat.title}
                value={stat.value}
                prefix={React.cloneElement(stat.icon, { style: { color: stat.color } })}
                valueStyle={{ color: stat.color }}
              />
              <div style={{ marginTop: 10 }}>
                <span style={{ color: '#52c41a' }}>
                  <ArrowUpOutlined /> 15% so với tháng trước
                </span>
              </div>
            </Card>
          </Col>
        ))}
      </Row>

      <Divider />

      {/* Biểu đồ doanh thu */}
      <Row gutter={[16, 16]}>
        <Col span={16}>
          <Card title="Doanh thu theo tháng">
            <div style={{ height: '350px' }}>
              <Bar data={revenueData} options={chartOptions} />
            </div>
          </Card>
        </Col>
        <Col span={8}>
          <Card title="Doanh thu theo danh mục">
            <div style={{ height: '350px' }}>
              <Pie data={categoryData} />
            </div>
          </Card>
        </Col>
      </Row>

      <Divider />

      {/* Top sản phẩm bán chạy và Đơn hàng gần đây */}
      <Row gutter={[16, 16]}>
        <Col span={8}>
          <Card title="Top sản phẩm bán chạy" style={{ height: '450px', overflow: 'auto' }}>
            <List
              itemLayout="horizontal"
              dataSource={topProducts}
              renderItem={(item) => (
                <List.Item>
                  <List.Item.Meta
                    avatar={<Avatar src={item.thumbnail} />}
                    title={item.name}
                    description={`Giá: ${formatCurrency(item.price)}`}
                  />
                  <div>Đã bán: {item.sold}</div>
                </List.Item>
              )}
            />
          </Card>
        </Col>
        <Col span={16}>
          <Card title="Đơn hàng gần đây" style={{ height: '450px', overflow: 'auto' }}>
            <Table
              columns={[
                { title: 'Mã đơn', dataIndex: 'id', key: 'id', width: '25%' },
                { title: 'Khách hàng', dataIndex: 'customer', key: 'customer', width: '20%' },
                { title: 'Ngày đặt', dataIndex: 'date', key: 'date', width: '15%' },
                { title: 'Tổng tiền', dataIndex: 'amount', key: 'amount', width: '20%' },
                { 
                  title: 'Trạng thái', 
                  dataIndex: 'status', 
                  key: 'status',
                  width: '20%',
                  render: (status) => <span>{formatOrderStatus(status)}</span>
                },
              ]}
              dataSource={recentOrders}
              rowKey="id"
              pagination={false}
              scroll={{ y: 350 }}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;