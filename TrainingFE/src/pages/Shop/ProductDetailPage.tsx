import React, { useEffect, useState } from 'react';
import { Typography, Rate, Button, Spin, Space, Badge, message } from 'antd';
import { ShoppingCartOutlined } from '@ant-design/icons';
import { productService } from '../../services/productService.ts';
import type { IProduct } from '../../types/product.types.ts';
import { useAppDispatch, useAppSelector } from '../../store/index.ts';
import { addToCart } from '../../store/cartSlice.ts';

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
  const [product, setProduct] = useState<IProduct | null>(null);
  const [selectedImage, setSelectedImage] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const dispatch = useAppDispatch();
  const cartItems = useAppSelector((state) => state.cart.items);
  const totalItemsInCart = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        setLoading(true);
        const data = await productService.getProductById(productId);
        setProduct(data);
        setSelectedImage(data.thumbnail);
      } catch {
        message.error('Không thể tải chi tiết sản phẩm!');
      } finally {
        setLoading(false);
      }
    };

    fetchDetail();
  }, [productId]);

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
          marginBottom: 32,
          borderBottom: '1px solid #000000',
          paddingBottom: 12,
        }}
      >
        <Space size={8}>
          <span
            onClick={onBackToShop}
            style={{
              fontSize: 18,
              color: '#333333',
              cursor: 'pointer',
            }}
          >
            Shop
          </span>
          <span style={{ fontSize: 18, color: '#333333' }}>/</span>
          <span style={{ fontSize: 18, fontWeight: 700, color: '#000000' }}>
            Product
          </span>
        </Space>

        <Badge count={totalItemsInCart} color="#B865D8" style={{ fontSize: 13 }}>
          <ShoppingCartOutlined style={{ fontSize: 32, color: '#000000', cursor: 'pointer' }} />
        </Badge>
      </div>

      <div style={{ display: 'flex', gap: 60, flexWrap: 'wrap' }}>
        <div style={{ width: 340, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div
            style={{
              width: '100%',
              height: 380,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: 16,
            }}
          >
            <img
              src={selectedImage || product.thumbnail}
              alt={product.title}
              style={{
                maxWidth: '100%',
                maxHeight: '100%',
                objectFit: 'contain',
              }}
            />
          </div>

          <div style={{ display: 'flex', gap: 12, marginTop: 16 }}>
            {product.images && product.images.length > 0 ? (
              product.images.slice(0, 4).map((img, idx) => (
                <div
                  key={idx}
                  onClick={() => setSelectedImage(img)}
                  style={{
                    width: 60,
                    height: 60,
                    border: selectedImage === img ? '2px solid #01AEEF' : '1px solid #d9d9d9',
                    borderRadius: 4,
                    padding: 4,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <img
                    src={img}
                    alt=""
                    style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
                  />
                </div>
              ))
            ) : (
              <div
                style={{
                  width: 60,
                  height: 60,
                  border: '2px solid #01AEEF',
                  borderRadius: 4,
                  padding: 4,
                }}
              >
                <img
                  src={product.thumbnail}
                  alt=""
                  style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
                />
              </div>
            )}
          </div>
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
              onClick={() => {
                dispatch(addToCart({ product, quantity: 1 }));
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
              onClick={() => {
                dispatch(addToCart({ product, quantity: 1 }));
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
