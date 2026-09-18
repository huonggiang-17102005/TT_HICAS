import React from 'react';
import { Typography, Empty, Button } from 'antd';
import { CloseOutlined } from '@ant-design/icons';
import { useAppDispatch, useAppSelector } from '../../store/index.ts';
import { updateQuantity, removeFromCart } from '../../store/cartSlice.ts';

const { Title, Text, Paragraph } = Typography;

interface CartPageProps {
  onBackToShop?: () => void;
}

export const CartPage: React.FC<CartPageProps> = ({ onBackToShop }) => {
  const dispatch = useAppDispatch();
  const { items, subtotal, tax, total } = useAppSelector((state) => state.cart);

  const totalItemsCount = items.reduce((sum, item) => sum + item.quantity, 0);

  const formatPriceVND = (usdPrice: number) => {
    const vndPrice = Math.round(usdPrice * 25000);
    return new Intl.NumberFormat('vi-VN').format(vndPrice) + ' VND';
  };

  return (
    <div style={{ background: '#ffffff', minHeight: '100%' }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'baseline',
          borderBottom: '1px solid #d9d9d9',
          paddingBottom: 8,
          marginBottom: 24,
        }}
      >
        <Title level={2} style={{ margin: 0, fontWeight: 800, fontSize: 28, color: '#000000' }}>
          Cart
        </Title>
        <Text style={{ fontSize: 16, color: '#333333' }}>
          {totalItemsCount} {totalItemsCount === 1 ? 'item' : 'items'} in bag
        </Text>
      </div>

      {items.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 0' }}>
          <Empty description="Giỏ hàng của bạn đang trống!" />
          <Button
            type="primary"
            style={{ marginTop: 16, background: '#01AEEF', borderColor: '#01AEEF' }}
            onClick={onBackToShop}
          >
            Quay lại mua sắm
          </Button>
        </div>
      ) : (
        <div>
          {items.map((item) => (
            <div
              key={item.product.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: '24px 0',
                borderBottom: '1px solid #d9d9d9',
                position: 'relative',
                gap: 32,
              }}
            >
              <div
                onClick={() => dispatch(removeFromCart(item.product.id))}
                style={{
                  position: 'absolute',
                  top: 0,
                  right: 0,
                  width: 20,
                  height: 20,
                  borderRadius: '50%',
                  background: '#8c8c8c',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  fontSize: 10,
                }}
              >
                <CloseOutlined />
              </div>

              <div
                style={{
                  width: 140,
                  height: 150,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <img
                  src={item.product.thumbnail}
                  alt={item.product.title}
                  style={{
                    maxWidth: '100%',
                    maxHeight: '100%',
                    objectFit: 'contain',
                  }}
                />
              </div>

              <div style={{ flex: 1, paddingRight: 40 }}>
                <Title level={4} style={{ margin: 0, fontWeight: 700, fontSize: 18, color: '#000000' }}>
                  {item.product.title}
                </Title>
                <Paragraph
                  ellipsis={{ rows: 3 }}
                  style={{
                    fontSize: 14,
                    color: '#333333',
                    lineHeight: 1.6,
                    margin: '10px 0 14px',
                  }}
                >
                  {item.product.description}
                </Paragraph>
                <Text
                  strong
                  style={{
                    fontSize: 22,
                    fontWeight: 800,
                    color: '#000000',
                  }}
                >
                  {formatPriceVND(item.product.price)}
                </Text>
              </div>

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 16,
                  fontSize: 18,
                  fontWeight: 600,
                  paddingRight: 20,
                  userSelect: 'none',
                }}
              >
                <span
                  onClick={() =>
                    dispatch(updateQuantity({ productId: item.product.id, quantity: item.quantity + 1 }))
                  }
                  style={{ cursor: 'pointer', padding: '4px 8px' }}
                >
                  +
                </span>

                <span style={{ minWidth: 20, textAlign: 'center' }}>{item.quantity}</span>

                <span
                  onClick={() =>
                    dispatch(updateQuantity({ productId: item.product.id, quantity: item.quantity - 1 }))
                  }
                  style={{ cursor: 'pointer', padding: '4px 8px' }}
                >
                  -
                </span>
              </div>
            </div>
          ))}

          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-end',
              marginTop: 32,
              paddingRight: 10,
              gap: 8,
            }}
          >
            <div style={{ display: 'flex', width: 280, justifyContent: 'space-between' }}>
              <Text strong style={{ fontSize: 16, color: '#000000' }}>
                SubTotal
              </Text>
              <Text strong style={{ fontSize: 16, color: '#000000' }}>
                {formatPriceVND(subtotal)}
              </Text>
            </div>

            <div style={{ display: 'flex', width: 280, justifyContent: 'space-between' }}>
              <Text strong style={{ fontSize: 16, color: '#000000' }}>
                Tax
              </Text>
              <Text strong style={{ fontSize: 16, color: '#000000' }}>
                {formatPriceVND(tax)}
              </Text>
            </div>

            <div style={{ display: 'flex', width: 280, justifyContent: 'space-between', marginTop: 4 }}>
              <Text strong style={{ fontSize: 18, color: '#000000' }}>
                Total
              </Text>
              <Text strong style={{ fontSize: 18, color: '#000000' }}>
                {formatPriceVND(total)}
              </Text>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
