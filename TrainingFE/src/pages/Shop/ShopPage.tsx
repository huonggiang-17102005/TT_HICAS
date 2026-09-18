import React, { useEffect, useState } from 'react';
import { Row, Col, Input, Spin, Typography, Space, message, Empty } from 'antd';
import { SearchOutlined, FilterFilled } from '@ant-design/icons';
import { productService } from '../../services/productService.ts';
import type { IProduct } from '../../types/product.types.ts';
import { ProductCard } from '../../components/shop/ProductCard.tsx';

const { Title, Text } = Typography;

interface ShopPageProps {
  onSelectProduct?: (id: number) => void;
}

export const ShopPage: React.FC<ShopPageProps> = ({ onSelectProduct }) => {
  const [products, setProducts] = useState<IProduct[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const data = await productService.getProducts();
      setProducts(data.products);
    } catch {
      message.error('Không thể tải danh sách sản phẩm!');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const handleSearch = async (value: string) => {
    try {
      setLoading(true);
      if (!value.trim()) {
        await loadProducts();
      } else {
        const data = await productService.searchProducts(value.trim());
        setProducts(data.products);
      }
    } catch {
      message.error('Lỗi khi tìm kiếm!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ background: '#ffffff', minHeight: '100%' }}>
      <Title
        level={2}
        style={{
          margin: 0,
          fontWeight: 800,
          fontSize: 28,
          color: '#000000',
        }}
      >
        Shop
      </Title>

      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginTop: 8,
          marginBottom: 32,
        }}
      >
        <Text style={{ fontSize: 18, color: '#333333' }}>Shop</Text>

        <Space size={16} align="center">
          <Input
            placeholder="Search..."
            suffix={<SearchOutlined style={{ fontSize: 20, color: '#000000' }} />}
            onPressEnter={(e) => handleSearch((e.target as HTMLInputElement).value)}
            style={{
              width: 280,
              height: 42,
              borderRadius: 0,
              border: '1px solid #000000',
              fontSize: 16,
            }}
          />
          <FilterFilled
            style={{
              fontSize: 28,
              color: '#000000',
              cursor: 'pointer',
            }}
            onClick={() => message.info('Bộ lọc Filter sẽ mở tại đây!')}
          />
        </Space>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '80px 0' }}>
          <Spin size="large" tip="Đang tải dữ liệu..." />
        </div>
      ) : products.length === 0 ? (
        <Empty description="Không tìm thấy sản phẩm nào!" />
      ) : (
        <Row gutter={[32, 28]}>
          {products.map((item) => (
            <Col key={item.id} xs={24} md={12}>
              <ProductCard
                product={item}
                onClick={(id) => onSelectProduct && onSelectProduct(id)}
              />
            </Col>
          ))}
        </Row>
      )}
    </div>
  );
};
