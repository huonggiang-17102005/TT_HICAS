import React, { useState, useEffect } from 'react';
import { Typography, Empty, Button } from 'antd';
import { CloseOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { useCart } from '../../hooks/useCart.ts';

const { Title, Text, Paragraph } = Typography;

interface QuantityControlProps {
  quantity: number;
  onUpdate: (qty: number) => void;
}

const QuantityControl: React.FC<QuantityControlProps> = ({ quantity, onUpdate }) => {
  const [val, setVal] = useState<string>(String(quantity));

  useEffect(() => {
    setVal(String(quantity));
  }, [quantity]);

  const handleCommit = (raw: string) => {
    const parsed = parseInt(raw, 10);
    if (!parsed || parsed < 1) {
      setVal('1');
      onUpdate(1);
    } else {
      const clamped = Math.min(9999, parsed);
      setVal(String(clamped));
      onUpdate(clamped);
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        userSelect: 'none',
        paddingRight: 10,
      }}
    >
      <button
        type="button"
        className="cart-qty-square-btn"
        onClick={() => onUpdate(quantity + 1)}
        style={{
          width: 38,
          height: 38,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: 4,
          border: 'none',
          background: '#f1f5f9',
          fontSize: 20,
          fontWeight: 600,
          cursor: 'pointer',
          color: '#000000',
          transition: 'all 0.2s',
        }}
        title="Tăng số lượng"
      >
        +
      </button>

      <input
        type="text"
        inputMode="numeric"
        className="cart-qty-square-input"
        value={val}
        onChange={(e) => {
          const onlyNums = e.target.value.replace(/\D/g, '');
          setVal(onlyNums);
          if (onlyNums && parseInt(onlyNums, 10) >= 1) {
            onUpdate(Math.min(9999, parseInt(onlyNums, 10)));
          }
        }}
        onBlur={() => handleCommit(val)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            handleCommit(val);
            (e.target as HTMLInputElement).blur();
          }
        }}
        style={{
          width: 38,
          height: 38,
          textAlign: 'center',
          fontWeight: 700,
          fontSize: 16,
          color: '#000000',
          border: '1px solid #cbd5e1',
          borderRadius: 4,
          background: '#ffffff',
          padding: 0,
          margin: 0,
          boxSizing: 'border-box',
          outline: 'none',
          transition: 'all 0.2s',
        }}
      />

      <button
        type="button"
        className="cart-qty-square-btn"
        onClick={() => onUpdate(Math.max(1, quantity - 1))}
        disabled={quantity <= 1}
        style={{
          width: 38,
          height: 38,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: 4,
          border: 'none',
          background: '#f1f5f9',
          fontSize: 20,
          fontWeight: 600,
          cursor: quantity <= 1 ? 'not-allowed' : 'pointer',
          opacity: quantity <= 1 ? 0.4 : 1,
          color: '#000000',
          transition: 'all 0.2s',
        }}
        title="Giảm số lượng"
      >
        -
      </button>
    </div>
  );
};

interface CartPageProps {
  onBackToShop?: () => void;
}

export const CartPage: React.FC<CartPageProps> = ({ onBackToShop }) => {
  const { t } = useTranslation();
  const { items, subtotal, tax, total, totalItemsCount, updateQuantity, removeFromCart } = useCart();

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
          {t('cart.title')}
        </Title>
        <Text style={{ fontSize: 16, color: '#333333' }}>
          {totalItemsCount === 1
            ? t('cart.itemInBag', { count: totalItemsCount })
            : t('cart.itemsInBag', { count: totalItemsCount })}
        </Text>
      </div>

      {items.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 0' }}>
          <Empty description={t('cart.emptyCart')} />
          <Button
            type="primary"
            style={{ marginTop: 16, background: '#01AEEF', borderColor: '#01AEEF', borderRadius: 6 }}
            onClick={onBackToShop}
          >
            {t('cart.backToShop')}
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
                borderBottom: '1px solid #f1f5f9',
                position: 'relative',
                gap: 32,
              }}
            >
              <div
                onClick={() => removeFromCart(item.product.id)}
                style={{
                  position: 'absolute',
                  top: 0,
                  right: 0,
                  width: 22,
                  height: 22,
                  borderRadius: '50%',
                  background: '#94a3b8',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  fontSize: 11,
                  transition: 'background 0.2s',
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
                  background: '#f8fafc',
                  borderRadius: 8,
                  padding: 8,
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
                    color: '#64748b',
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
                    color: '#01AEEF',
                  }}
                >
                  {formatPriceVND(item.product.price)}
                </Text>
              </div>

              <QuantityControl
                quantity={item.quantity}
                onUpdate={(qty) => updateQuantity(item.product.id, qty)}
              />
            </div>
          ))}

          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-end',
              marginTop: 32,
              paddingRight: 10,
              gap: 10,
            }}
          >
            <div style={{ display: 'flex', width: 280, justifyContent: 'space-between' }}>
              <Text strong style={{ fontSize: 16, color: '#64748b' }}>
                {t('cart.subtotal')}
              </Text>
              <Text strong style={{ fontSize: 16, color: '#000000' }}>
                {formatPriceVND(subtotal)}
              </Text>
            </div>

            <div style={{ display: 'flex', width: 280, justifyContent: 'space-between' }}>
              <Text strong style={{ fontSize: 16, color: '#64748b' }}>
                {t('cart.tax')}
              </Text>
              <Text strong style={{ fontSize: 16, color: '#000000' }}>
                {formatPriceVND(tax)}
              </Text>
            </div>

            <div style={{ display: 'flex', width: 280, justifyContent: 'space-between', marginTop: 4, paddingTop: 8, borderTop: '1px solid #e2e8f0' }}>
              <Text strong style={{ fontSize: 20, color: '#000000' }}>
                {t('cart.total')}
              </Text>
              <Text strong style={{ fontSize: 20, color: '#01AEEF' }}>
                {formatPriceVND(total)}
              </Text>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
