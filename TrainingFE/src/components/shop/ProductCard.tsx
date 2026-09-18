import React from 'react';
import { Rate, Typography } from 'antd';
import type { IProduct } from '../../types/product.types.ts';

const { Text, Title } = Typography;

interface ProductCardProps {
  product: IProduct;
  onClick?: (id: number) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onClick }) => {
  const formatPriceVND = (usdPrice: number) => {
    const vndPrice = Math.round(usdPrice * 25000);
    return new Intl.NumberFormat('vi-VN').format(vndPrice) + ' VND';
  };

  return (
    <div
      onClick={() => onClick && onClick(product.id)}
      style={{
        display: 'flex',
        alignItems: 'center',
        padding: '16px 20px',
        background: '#ffffff',
        cursor: 'pointer',
        gap: 24,
        transition: 'transform 0.2s',
      }}
      onMouseEnter={(e) => (e.currentTarget.style.transform = 'translateY(-2px)')}
      onMouseLeave={(e) => (e.currentTarget.style.transform = 'translateY(0)')}
    >
      <div
        style={{
          width: 130,
          height: 140,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}
      >
        <img
          src={product.thumbnail}
          alt={product.title}
          style={{
            maxWidth: '100%',
            maxHeight: '100%',
            objectFit: 'contain',
          }}
        />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        <Title
          level={5}
          ellipsis={{ rows: 1 }}
          style={{
            margin: 0,
            fontSize: 16,
            fontWeight: 700,
            color: '#000000',
          }}
        >
          {product.title}
        </Title>

        <Text
          strong
          style={{
            fontSize: 22,
            fontWeight: 800,
            color: '#000000',
            letterSpacing: 0.5,
          }}
        >
          {formatPriceVND(product.price)}
        </Text>

        <Rate
          disabled
          allowHalf
          defaultValue={product.rating}
          style={{
            fontSize: 26,
            color: '#F2C94C',
          }}
        />
      </div>
    </div>
  );
};
