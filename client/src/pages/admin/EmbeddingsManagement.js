import React, { useState, useEffect } from 'react';
import { Card, Table, Button, Space, Tag, Tooltip, Statistic, Row, Col, notification, Progress, Tabs, Alert, Divider } from 'antd';
import { ReloadOutlined, SyncOutlined, CheckCircleOutlined, ExclamationCircleOutlined, CloudOutlined, DatabaseOutlined } from '@ant-design/icons';
import { 
  apiGenerateAllEmbeddings, 
  apiGenerateMissingEmbeddings, 
  apiGetEmbeddingStats, 
  apiGetProductsWithEmbeddingStatus, 
  apiGenerateProductEmbedding
} from 'api/embedding';
import withBase from 'hocs/withBase';

const EmbeddingsManagement = ({ dispatch }) => {
  const [loading, setLoading] = useState(false);
  const [reloading, setReloading] = useState(false);
  const [stats, setStats] = useState(null);
  const [products, setProducts] = useState([]);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0 });
  
  const fetchStats = async () => {
    try {
      const response = await apiGetEmbeddingStats();
      if (response.success) {
        setStats(response.stats);
      }
    } catch (error) {
      console.error('Error fetching embedding stats:', error);
    }
  };

  const fetchProductsWithEmbeddingStatus = async (page = 1, pageSize = 10) => {
    try {
      setLoading(true);
      const response = await apiGetProductsWithEmbeddingStatus({
        page, 
        limit: pageSize
      });
      
      if (response.success) {
        setProducts(response.products);
        setPagination({
          ...pagination,
          current: page,
          total: response.total
        });
      }
    } catch (error) {
      console.error('Error fetching products with embedding status:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleReloadAllEmbeddings = async () => {
    try {
      setReloading(true);
      notification.info({
        message: 'Đang cập nhật tất cả Embeddings sản phẩm',
        description: 'Quá trình này có thể mất vài phút tùy thuộc vào số lượng sản phẩm.',
        duration: 3
      });

      const response = await apiGenerateAllEmbeddings();
      
      if (response) {
        notification.success({
          message: 'Cập nhật Embeddings sản phẩm thành công',
          description: `Đã tạo embeddings cho sản phẩm.`,
          duration: 4
        });
        fetchStats();
        fetchProductsWithEmbeddingStatus(pagination.current, pagination.pageSize);
      }
    } catch (error) {
      // Vẫn hiển thị thông báo thành công nếu lỗi là do timeout hoặc lỗi kết nối
      if (error.code === 'ECONNABORTED' || !error.response) {
        notification.success({
          message: 'Quá trình tạo embeddings đã được khởi chạy',
          description: 'Máy chủ đang xử lý yêu cầu, quá trình này có thể mất thời gian dài với dữ liệu lớn.',
          duration: 4
        });
        setTimeout(() => fetchStats(), 5000); // Tải lại thống kê sau 5 giây
      } else {
        notification.error({
          message: 'Cập nhật Embeddings thất bại',
          description: error.response?.data?.message || 'Vui lòng thử lại sau',
          duration: 4
        });
      }
    } finally {
      setReloading(false);
    }
  };

  const handleReloadMissingEmbeddings = async () => {
    try {
      setReloading(true);
      notification.info({
        message: 'Đang cập nhật Embeddings còn thiếu',
        description: 'Hệ thống đang tạo embeddings cho các sản phẩm mới.',
        duration: 3
      });

      const response = await apiGenerateMissingEmbeddings();
      
      if (response) {
        notification.success({
          message: 'Cập nhật Embeddings thành công',
          description: 'Đã tạo embeddings cho các sản phẩm còn thiếu.',
          duration: 4
        });
        fetchStats();
        fetchProductsWithEmbeddingStatus(pagination.current, pagination.pageSize);
      }
    } catch (error) {
      // Vẫn hiển thị thông báo thành công nếu lỗi là do timeout hoặc lỗi kết nối
      if (error.code === 'ECONNABORTED' || !error.response) {
        notification.success({
          message: 'Quá trình tạo embeddings đã được khởi chạy',
          description: 'Máy chủ đang xử lý yêu cầu, quá trình này có thể mất thời gian.',
          duration: 4
        });
        setTimeout(() => fetchStats(), 5000); // Tải lại thống kê sau 5 giây
      } else {
        notification.error({
          message: 'Cập nhật Embeddings thất bại',
          description: error.response?.data?.message || 'Vui lòng thử lại sau',
          duration: 4
        });
      }
    } finally {
      setReloading(false);
    }
  };

  const handleUpdateSingleEmbedding = async (productId) => {
    try {
      const response = await apiGenerateProductEmbedding(productId);
      if (response) {
        notification.success({
          message: 'Cập nhật Embedding thành công',
          description: `Đã tạo embedding cho sản phẩm.`,
          duration: 3
        });
        fetchProductsWithEmbeddingStatus(pagination.current, pagination.pageSize);
        fetchStats();
      }
    } catch (error) {
      // Vẫn hiển thị thông báo thành công nếu lỗi là do timeout hoặc lỗi kết nối
      if (error.code === 'ECONNABORTED' || !error.response) {
        notification.success({
          message: 'Embedding đã được khởi tạo',
          description: 'Quá trình tạo embeddings đang được thực hiện trên server.',
          duration: 3
        });
        setTimeout(() => fetchProductsWithEmbeddingStatus(pagination.current, pagination.pageSize), 2000);
      } else {
        notification.error({
          message: 'Cập nhật Embedding thất bại',
          description: error.response?.data?.message || 'Vui lòng thử lại sau',
          duration: 3
        });
      }
    }
  };

  const handleTableChange = (pagination) => {
    fetchProductsWithEmbeddingStatus(pagination.current, pagination.pageSize);
  };

  useEffect(() => {
    fetchStats();
    fetchProductsWithEmbeddingStatus();
  }, []);

  const columns = [
    {
      title: 'Tên sản phẩm',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: 'Trạng thái Embedding',
      key: 'hasEmbedding',
      render: (_, record) => (
        record.hasEmbedding 
          ? <Tag color="success" icon={<CheckCircleOutlined />}>Đã có Embedding</Tag>
          : <Tag color="error" icon={<ExclamationCircleOutlined />}>Chưa có Embedding</Tag>
      ),
    },
    {
      title: 'Hành động',
      key: 'action',
      render: (_, record) => (
        <Tooltip title="Cập nhật Embedding cho sản phẩm này">
          <Button
            type="primary"
            size="small"
            icon={<SyncOutlined />}
            onClick={() => handleUpdateSingleEmbedding(record._id)}
          >
            Cập nhật
          </Button>
        </Tooltip>
      ),
    },
  ];

  const items = [
    {
      key: '1',
      label: 'Tổng quan',
      children: (
        <div>
          <Row gutter={16} className="mb-4">
            <Col span={24}>
              <Alert
                message={stats?.usingAtlas ? (
                  <div>
                    <CloudOutlined className="mr-2 text-blue-500" />
                    <span className="font-semibold">Đang sử dụng MongoDB Atlas cho Vector Search</span>
                  </div>
                ) : (
                  <div>
                    <DatabaseOutlined className="mr-2 text-orange-500" />
                    <span className="font-semibold">Đang sử dụng MongoDB Compass local với tính toán similarity</span>
                  </div>
                )}
                description={stats?.usingAtlas ? 
                  "Hệ thống đang sử dụng MongoDB Atlas cho lưu trữ embeddings và tìm kiếm vector, giúp tăng hiệu suất tìm kiếm." : 
                  "Hệ thống đang sử dụng MongoDB Compass local cho lưu trữ embeddings và tính toán cosine similarity. Để tăng hiệu suất, hãy thiết lập MongoDB Atlas."
                }
                type={stats?.usingAtlas ? "success" : "warning"}
                showIcon={false}
                className="mb-4"
              />
            </Col>
          </Row>

          <Row gutter={16} className="mb-4">
            <Col span={24}>
              <Card>
                <Statistic
                  title="Sản phẩm"
                  value={stats?.products?.withEmbedding || 0}
                  suffix={`/ ${stats?.products?.total || 0}`}
                />
                <Progress 
                  percent={parseFloat(stats?.products?.percentage || 0)} 
                  status={parseFloat(stats?.products?.percentage || 0) < 100 ? "active" : "success"}
                />
                <Button 
                  type="primary"
                  size="small"
                  className="mt-2"
                  onClick={handleReloadAllEmbeddings}
                  loading={reloading}
                >
                  Cập nhật tất cả
                </Button>
              </Card>
            </Col>
          </Row>
          
          <Divider />
          
          <Row gutter={16} className="mb-4">
            <Col span={24}>
              <Card title="Đồng bộ Embeddings">
                <Space>
                  <Button
                    type="primary"
                    icon={<SyncOutlined />}
                    loading={reloading}
                    onClick={handleReloadAllEmbeddings}
                  >
                    Đồng bộ tất cả Embeddings
                  </Button>
                  <Button
                    type="default"
                    icon={<ReloadOutlined />}
                    loading={reloading}
                    onClick={handleReloadMissingEmbeddings}
                  >
                    Đồng bộ Embeddings còn thiếu
                  </Button>
                </Space>
              </Card>
            </Col>
          </Row>
        </div>
      ),
    },
    {
      key: '2',
      label: 'Danh sách sản phẩm',
      children: (
        <Table
          dataSource={products}
          columns={columns}
          rowKey="_id"
          pagination={pagination}
          onChange={handleTableChange}
          loading={loading}
        />
      ),
    },
  ];

  return (
    <div className="p-4">
      <h1 className="text-xl font-semibold mb-4">Quản lý Embeddings sản phẩm</h1>
      
      <Tabs defaultActiveKey="1" items={items} />
    </div>
  );
};

export default withBase(EmbeddingsManagement); 