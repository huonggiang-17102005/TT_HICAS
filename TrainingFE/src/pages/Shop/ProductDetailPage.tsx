import React, { useState } from 'react';
import { Typography, Rate, Button, Spin, Space, Badge, message } from 'antd';
import { ShoppingCartOutlined } from '@ant-design/icons';
import type { IProduct } from '../../types/product.types.ts';
import { useProductDetail } from '../../hooks/useProducts.ts';
import { useCart } from '../../hooks/useCart.ts';

const { Title, Text, Paragraph } = Typography;

interface ProductDetailPageProps {
  productId?: number;
  onBackToShop?: () => void;
  onAddToCart?: (product: IProduct) => void;
  cartCount?: number;
}

export const ProductDetailPage: React.FC<ProductDetailPageProps> = ({
  productId = 1,
  onBackToShop,
}) => {
  const { data: product, isLoading: loading } = useProductDetail(productId);
  const { addToCart, totalItemsCount } = useCart();
  const [activeImage, setActiveImage] = useState<string>('');

  const formatPriceVND = (usdPrice: number) => {
    const vndPrice = Math.round(usdPrice * 25000);
    return new Intl.NumberFormat('vi-VN').format(vndPrice) + ' VND';
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '100px 0' }}>
        <Spin size="large" tip="Đang tải chi tiết điện thoại..." />
      </div>
    );
  }

  if (!product) {
    return <div>Không tìm thấy thông tin sản phẩm.</div>;
  }

  const currentDisplayImage = activeImage || product.thumbnail;

  return (
    <div style={{ background: '#ffffff', minHeight: '100%' }}>
      <Title level={2} style={{ margin: 0, fontWeight: 800, fontSize: 28 }}>
        Shop
      </Title>

      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginTop: 8,
          marginBottom: 36,
        }}
      >
        <Space size={8} style={{ fontSize: 16 }}>
          <span
            onClick={onBackToShop}
            style={{ cursor: 'pointer', color: '#666666', textDecoration: 'none' }}
          >
            Shop
          </span>
          <span style={{ color: '#999999' }}>&gt;</span>
          <span style={{ color: '#000000', fontWeight: 600 }}>{product.title}</span>
        </Space>

        <Badge count={totalItemsCount} size="small" offset={[-2, 4]}>
          <ShoppingCartOutlined
            style={{ fontSize: 28, color: '#000000', cursor: 'pointer' }}
            onClick={() => {
              if (onBackToShop) {
                window.location.href = '/cart';
              }
            }}
          />
        </Badge>
      </div>

      <div
        style={{
          display: 'flex',
          gap: 60,
          alignItems: 'flex-start',
          flexWrap: 'wrap',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div
            style={{
              width: 380,
              height: 380,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: '#ffffff',
            }}
          >
            <img
              src={currentDisplayImage}
              alt={product.title}
              style={{
                maxWidth: '100%',
                maxHeight: '100%',
                objectFit: 'contain',
              }}
            />
          </div>

          {product.images && product.images.length > 0 && (
            <div style={{ display: 'flex', gap: 14 }}>
              {product.images.slice(0, 4).map((img, idx) => (
                <div
                  key={idx}
                  onClick={() => setActiveImage(img)}
                  style={{
                    width: 70,
                    height: 70,
                    padding: 4,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: currentDisplayImage === img ? '2px solid #01AEEF' : '1px solid #d9d9d9',
                    borderRadius: 4,
                    cursor: 'pointer',
                    background: '#ffffff',
                  }}
                >
                  <img
                    src={img}
                    alt="thumbnail"
                    style={{
                      maxWidth: '100%',
                      maxHeight: '100%',
                      objectFit: 'contain',
                    }}
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        <div style={{ flex: 1, minWidth: 320, maxWidth: 620 }}>
          <Title level={3} style={{ margin: 0, fontWeight: 700, fontSize: 22, color: '#000000' }}>
            {product.title}
          </Title>

          <Paragraph
            style={{
              fontSize: 15,
              color: '#333333',
              lineHeight: 1.7,
              marginTop: 18,
              marginBottom: 20,
            }}
          >
            {product.description}
          </Paragraph>

          <div style={{ marginBottom: 12 }}>
            <Text
              strong
              style={{
                fontSize: 26,
                fontWeight: 800,
                color: '#000000',
              }}
            >
              {formatPriceVND(product.price)}
            </Text>
          </div>

          <div style={{ marginBottom: 32 }}>
            <Rate
              disabled
              allowHalf
              defaultValue={product.rating}
              style={{
                fontSize: 32,
                color: '#F2C94C',
              }}
            />
          </div>

          <div style={{ display: 'flex', gap: 20 }}>
            <Button
              type="primary"
              style={{
                background: '#60C3F2',
                borderColor: '#60C3F2',
                color: '#ffffff',
                fontWeight: 700,
                fontSize: 18,
                height: 52,
                padding: '0 36px',
                borderRadius: 6,
                boxShadow: 'none',
              }}
              onClick={async () => {
                await addToCart(product, 1);
                message.success('Đã chọn Mua Ngay!');
              }}
            >
              Mua Ngay
            </Button>

            <Button
              style={{
                background: '#77ED4B',
                borderColor: '#77ED4B',
                color: '#ffffff',
                fontWeight: 700,
                fontSize: 18,
                height: 52,
                padding: '0 32px',
                borderRadius: 6,
                boxShadow: 'none',
              }}
              onClick={async () => {
                await addToCart(product, 1);
                message.success(`Đã thêm "${product.title}" vào giỏ hàng!`);
              }}
            >
              Thêm vào giỏ hàng
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
