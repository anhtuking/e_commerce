import React, { useCallback, useEffect, useState } from 'react';
import { Bar, Pie, Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend } from 'chart.js';
import { Card, Row, Col, Table, Typography, Statistic, Divider, List, Avatar, Spin, notification, Badge, Radio } from 'antd';
import { DollarOutlined, ShoppingOutlined, UserOutlined, ArrowUpOutlined } from '@ant-design/icons';
import RefreshIcon from '@mui/icons-material/Refresh';
import { getConfig, formatPrice, formatOrderStatus } from '../../utils/helpers';
import { apiGetRecentOrders, apiGetRevenueStats, apiGetStatistics, apiGetTopProducts } from 'api';
import { Box, Button } from '@mui/material';
import { FaRegArrowAltCircleUp , FaHistory } from "react-icons/fa";

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend);

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [error, setError] = useState(null);
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
  const [revenueType, setRevenueType] = useState('monthly');

  const fetchDashboardData = useCallback(async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      setError(null);
      
      // Cập nhật thời gian refresh
      setLastUpdated(new Date());
  
      // Lấy config có token và header
      const config = getConfig();
      config.withCredentials = true;
  
      // Lấy thống kê tổng quan
      const statsRes = await apiGetStatistics(config);
      if (statsRes?.success) {
        setStatsData({
          totalRevenue: statsRes.totalRevenue,
          totalOrders: statsRes.totalOrders,
          totalCustomers: statsRes.totalCustomers,
        });
      }
  
      // Lấy dữ liệu doanh thu theo tháng và doanh thu theo danh mục
      const revenueRes = await apiGetRevenueStats({ ...config, params: { type: revenueType } });
      if (revenueRes?.success) {
        setRevenueData(revenueRes.revenueData);
        setCategoryData(revenueRes.categoryData);
      }
  
      // Lấy top sản phẩm bán chạy
      const topProductsRes = await apiGetTopProducts(config);
      if (topProductsRes?.success) {
        setTopProducts(topProductsRes.data);
      }
  
      // Lấy danh sách đơn hàng gần đây
      const recentOrdersRes = await apiGetRecentOrders(config);
      if (recentOrdersRes?.success) {
        setRecentOrders(recentOrdersRes.data);
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      setError("Không thể tải dữ liệu từ server. Vui lòng thử lại sau.");
      notification.error({
        message: 'Lỗi',
        description: 'Không thể tải dữ liệu thống kê từ server.',
        duration: 5,
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [revenueType]);

  useEffect(() => {
    fetchDashboardData();
    // Auto refresh mỗi 1 phút
    const refreshInterval = setInterval(() => {
      fetchDashboardData(true);
    }, 60000);
    return () => clearInterval(refreshInterval);
  }, [fetchDashboardData]);
  
  const handleRefresh = () => {
    fetchDashboardData(true);
  };  

  // Xử lý khi thay đổi loại thống kê
  const handleRevenueTypeChange = (e) => {
    setRevenueType(e.target.value);
  };

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
      legend: { 
        position: revenueType === 'quarterly' ? 'right' : 'top',
        labels: {
          font: {
            size: 14
          }
        }
      },
      title: { 
        display: true, 
        text: revenueType === 'monthly' ? 'Doanh thu theo tháng' : 'Doanh thu theo quý',
        font: {
          size: 16
        }
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            let label = context.dataset.label || '';
            
            if (revenueType === 'monthly') {
              // Cho biểu đồ cột, giá trị nằm trong context.parsed.y
              return `${label}: ${context.parsed.y} triệu đồng`;
            } else {
              // Cho biểu đồ tròn, cần hiển thị cả tên quý (từ labels) và giá trị
              const quarterName = revenueData.labels[context.dataIndex] || context.label;
              return `${quarterName}: ${context.raw} triệu đồng`;
            }
          },
          // Thêm title callback để hiển thị đúng tiêu đề cho tooltip
          title: function(context) {
            if (revenueType === 'quarterly') {
              // Không hiển thị title mặc định cho biểu đồ tròn
              return '';
            }
            // Giữ nguyên title mặc định cho biểu đồ cột
            return context[0].label;
          }
        }
      }
    },
    ...(revenueType === 'monthly' && {
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            callback: function(value) {
              return value + ' triệu';
            }
          }
        }
      }
    })
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
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Dashboard
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {lastUpdated && (
            <Typography variant="caption" color="text.secondary" sx={{ mr: 2, marginRight: '8px' }}>
              Cập nhật lần cuối: {lastUpdated.toLocaleTimeString()}
            </Typography>
          )}
          <Badge color="secondary" variant="dot" invisible={!refreshing}>
            <Button 
              startIcon={<RefreshIcon />} 
              onClick={handleRefresh}
              disabled={refreshing}
              variant="outlined"
              size="small"
              sx={{ marginLeft: '8px' }}
            >
              {refreshing ? 'Đang cập nhật...' : 'Cập nhật'}
            </Button>
          </Badge>
        </Box>
      </Box>

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
                  <ArrowUpOutlined /> % so với tháng trước
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
          <Card 
            title={
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span>Doanh thu</span>
                <Radio.Group 
                  value={revenueType} 
                  onChange={handleRevenueTypeChange}
                  optionType="button"
                  buttonStyle="solid"
                >
                  <Radio.Button value="monthly">Theo tháng</Radio.Button>
                  <Radio.Button value="quarterly">Theo quý</Radio.Button>
                </Radio.Group>
              </Box>
            }
          >
            <div style={{ height: '350px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              {revenueType === 'monthly' ? (
                <Bar 
                  data={revenueData}
                  options={chartOptions} 
                />
              ) : (
                <div style={{ width: '80%', height: '80%' }}>
                  <Doughnut
                    data={(() => {
                      // Tính toán dữ liệu theo quý
                      const quarterlyData = [
                        // Quý 1: T1 + T2 + T3
                        (revenueData.datasets[0].data[0] || 0) + 
                        (revenueData.datasets[0].data[1] || 0) + 
                        (revenueData.datasets[0].data[2] || 0),
                        // Quý 2: T4 + T5 + T6
                        (revenueData.datasets[0].data[3] || 0) + 
                        (revenueData.datasets[0].data[4] || 0) + 
                        (revenueData.datasets[0].data[5] || 0),
                        // Quý 3: T7 + T8 + T9
                        (revenueData.datasets[0].data[6] || 0) + 
                        (revenueData.datasets[0].data[7] || 0) + 
                        (revenueData.datasets[0].data[8] || 0),
                        // Quý 4: T10 + T11 + T12
                        (revenueData.datasets[0].data[9] || 0) + 
                        (revenueData.datasets[0].data[10] || 0) + 
                        (revenueData.datasets[0].data[11] || 0),
                      ];

                      // Lọc ra chỉ những quý có dữ liệu
                      const quartersWithData = [];
                      const labelsWithData = [];
                      const backgroundColorsWithData = [];
                      const borderColorsWithData = [];
                      
                      const allQuarterLabels = ['Quý 1', 'Quý 2', 'Quý 3', 'Quý 4'];
                      const backgroundColors = [
                        'rgba(255, 99, 132, 0.7)',
                        'rgba(54, 162, 235, 0.7)',
                        'rgba(255, 206, 86, 0.7)',
                        'rgba(75, 192, 192, 0.7)',
                      ];
                      const borderColors = [
                        'rgba(255, 99, 132, 1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(255, 206, 86, 1)',
                        'rgba(75, 192, 192, 1)',
                      ];
                      
                      // Chỉ lấy những quý có doanh thu > 0
                      quarterlyData.forEach((value, index) => {
                        if (value > 0) {
                          quartersWithData.push(value);
                          labelsWithData.push(allQuarterLabels[index]);
                          backgroundColorsWithData.push(backgroundColors[index]);
                          borderColorsWithData.push(borderColors[index]);
                        }
                      });
                      
                      // Nếu không có quý nào có dữ liệu, hiển thị thông báo "Không có dữ liệu"
                      if (quartersWithData.length === 0) {
                        return {
                          labels: ['Không có dữ liệu'],
                          datasets: [{
                            label: 'Doanh thu (triệu đồng)',
                            data: [1],
                            backgroundColor: ['rgba(200, 200, 200, 0.7)'],
                            borderColor: ['rgba(200, 200, 200, 1)'],
                            borderWidth: 2,
                          }]
                        };
                      }
                      
                      return {
                        labels: labelsWithData,
                        datasets: [{
                          label: 'Doanh thu (triệu đồng)',
                          data: quartersWithData,
                          backgroundColor: backgroundColorsWithData,
                          borderColor: borderColorsWithData,
                          borderWidth: 2,
                          hoverOffset: 15
                        }]
                      };
                    })()}
                    options={{
                      ...chartOptions,
                      cutout: '60%',
                      plugins: {
                        ...chartOptions.plugins,
                        title: {
                          display: false
                        }
                      }
                    }}
                  />
                </div>
              )}
            </div>
          </Card>
        </Col>
        <Col span={8}>
          <Card title="Doanh thu theo danh mục">
            <div style={{ height: '350px' }} className='w-full flex justify-center items-center'>
              <Pie data={categoryData} />
            </div>
          </Card>
        </Col>
      </Row>

      <Divider />

      {/* Top sản phẩm bán chạy và Đơn hàng gần đây */}
      <Row gutter={[16, 16]}>
        <Col span={8}>
          <Card
            title={
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <FaRegArrowAltCircleUp style={{ marginRight: '8px' }} />
                <Typography variant="h6" className='text-xl'>Top sản phẩm bán chạy</Typography>
              </Box>
            }
            extra={<span style={{ fontSize: '12px', color: '#888' }}>*Từ đơn hàng đã thanh toán*</span>}
            style={{ height: '450px', overflow: 'auto' }}
          >
            <List
              itemLayout="horizontal"
              dataSource={topProducts}
              renderItem={(item) => (
                <List.Item>
                  <List.Item.Meta
                    avatar={<Avatar src={item.avatar} size="large" />}
                    title={item.name}
                  />
                  <div className="font-semibold text-main pl-2">
                    Đã bán: {item.totalSold}
                  </div>
                </List.Item>
              )}
            />
          </Card>
        </Col>
        <Col span={16}>
          <Card
            title={
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <FaHistory style={{ marginRight: '8px' }} />
                <Typography variant="h6" className='text-xl'>Đơn hàng gần đây</Typography>
              </Box>
            }
            extra={<span style={{ fontSize: '12px', color: '#888' }}>*Từ khách hàng đã thanh toán*</span>}
            style={{ height: '450px', overflow: 'auto' }}
          >
            <Table
              columns={[
                { title: 'Mã đơn', dataIndex: 'id', key: 'id', width: '25%' },
                { title: 'Khách hàng', dataIndex: 'customer', key: 'customer', width: '20%' },
                { title: 'Ngày đặt', dataIndex: 'date', key: 'date', width: '15%' },
                { title: 'Tổng tiền', dataIndex: 'amount', key: 'amount', width: '15%' },
                { title: 'Phương thức', dataIndex: 'typePayment', key: 'typePayment', width: '15%' },
                {
                  title: 'Trạng thái',
                  dataIndex: 'status',
                  key: 'status',
                  width: '20%',
                  render: (status) => <span>{formatOrderStatus(status)}</span>,
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