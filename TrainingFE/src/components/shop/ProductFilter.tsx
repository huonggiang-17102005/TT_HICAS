import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';

export interface ProductFilterProps {
  minPrice: number;
  maxPrice: number | null;
  minRating: number;
  maxRating: number;
  onChangePrice: (min: number, max: number | null) => void;
  onChangeRating: (min: number, max: number) => void;
}

const ChevronDown: React.FC<{ isOpen?: boolean }> = ({ isOpen }) => (
  <svg
    width="14"
    height="9"
    viewBox="0 0 14 9"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    style={{
      display: 'inline-block',
      flexShrink: 0,
      transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
      transition: 'transform 0.2s ease',
    }}
  >
    <path
      d="M1.5 1.5L7 7L12.5 1.5"
      stroke="#000000"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const ProductFilter: React.FC<ProductFilterProps> = ({
  minPrice,
  maxPrice,
  minRating,
  maxRating,
  onChangePrice,
  onChangeRating,
}) => {
  const { t } = useTranslation();
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const currencyText = t('filter.currency');
  const allText = t('filter.all');
  const formatStars = (val: number) => `${val} ${val <= 1 ? t('filter.star') : t('filter.stars')}`;

  const priceFromOptions = [
    { label: `0 ${currencyText}`, value: 0 },
    { label: `2 000 000 ${currencyText}`, value: 2000000 },
    { label: `5 000 000 ${currencyText}`, value: 5000000 },
    { label: `10 000 000 ${currencyText}`, value: 10000000 },
    { label: `15 000 000 ${currencyText}`, value: 15000000 },
    { label: `20 000 000 ${currencyText}`, value: 20000000 },
  ];

  const priceToOptions = [
    { label: `5 000 000 ${currencyText}`, value: 5000000 },
    { label: `10 000 000 ${currencyText}`, value: 10000000 },
    { label: `15 000 000 ${currencyText}`, value: 15000000 },
    { label: `20 000 000 ${currencyText}`, value: 20000000 },
    { label: `30 000 000 ${currencyText}`, value: 30000000 },
    { label: `50 000 000 ${currencyText}`, value: 50000000 },
    { label: allText, value: null },
  ];

  const ratingFromOptions = [0, 1, 2, 3, 4, 5].map((val) => ({
    label: formatStars(val),
    value: val,
  }));

  const ratingToOptions = [1, 2, 3, 4, 5].map((val) => ({
    label: formatStars(val),
    value: val,
  }));

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setActiveDropdown(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const formatPriceText = (val: number | null): string => {
    if (val === null) return allText;
    if (val === 0) return `0 ${currencyText}`;
    return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ') + ` ${currencyText}`;
  };

  const renderDropdownRow = (
    label: string,
    key: string,
    currentDisplay: string,
    options: { label: string; value: number | null }[],
    onSelect: (val: number | null) => void,
    selectedValue: number | null
  ) => {
    const isOpen = activeDropdown === key;

    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          position: 'relative',
          userSelect: 'none',
        }}
      >
        <span style={{ fontSize: 16, color: '#000000', fontWeight: 400 }}>{label}</span>

        <div
          onClick={() => setActiveDropdown(isOpen ? null : key)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            cursor: 'pointer',
            padding: '4px 6px',
            borderRadius: 2,
            transition: 'background 0.2s',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f5f5f5')}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
        >
          <span style={{ fontSize: 16, color: '#000000', fontWeight: 400 }}>
            {currentDisplay}
          </span>
          <ChevronDown isOpen={isOpen} />
        </div>

        {isOpen && (
          <div
            style={{
              position: 'absolute',
              top: 'calc(100% + 4px)',
              right: 0,
              zIndex: 1000,
              background: '#ffffff',
              border: '1px solid #000000',
              boxShadow: '0 4px 14px rgba(0,0,0,0.18)',
              minWidth: 150,
              maxHeight: 180,
              overflowY: 'auto',
            }}
          >
            {options.map((opt) => {
              const isSelected = opt.value === selectedValue;
              return (
                <div
                  key={String(opt.value)}
                  onClick={() => {
                    onSelect(opt.value);
                    setActiveDropdown(null);
                  }}
                  style={{
                    padding: '8px 14px',
                    fontSize: 14,
                    color: isSelected ? '#000000' : '#333333',
                    fontWeight: isSelected ? 700 : 400,
                    backgroundColor: isSelected ? '#ebebeb' : '#ffffff',
                    cursor: 'pointer',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                  onMouseEnter={(e) => {
                    if (!isSelected) e.currentTarget.style.backgroundColor = '#f5f5f5';
                  }}
                  onMouseLeave={(e) => {
                    if (!isSelected) e.currentTarget.style.backgroundColor = '#ffffff';
                  }}
                >
                  <span>{opt.label}</span>
                  {isSelected && <span style={{ fontSize: 12 }}>✓</span>}
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  };

  return (
    <div
      ref={containerRef}
      style={{
        width: 270,
        background: '#ffffff',
        border: '1px solid #000000',
        boxShadow: '0 4px 16px rgba(0, 0, 0, 0.15)',
        boxSizing: 'border-box',
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: '12px 16px',
          textAlign: 'center',
          fontWeight: 700,
          fontSize: 18,
          color: '#000000',
          borderBottom: '1px solid #000000',
        }}
      >
        {t('filter.title')}
      </div>

      {/* Body */}
      <div style={{ padding: '18px 24px 24px 24px' }}>
        {/* Giá */}
        <div>
          <div
            style={{
              textAlign: 'center',
              fontWeight: 500,
              fontSize: 17,
              color: '#000000',
              marginBottom: 12,
            }}
          >
            {t('filter.price')}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {renderDropdownRow(
              t('filter.from'),
              'minPrice',
              formatPriceText(minPrice),
              priceFromOptions,
              (val) => {
                const newMin = val ?? 0;
                const newMax = maxPrice !== null && maxPrice < newMin ? newMin : maxPrice;
                onChangePrice(newMin, newMax);
              },
              minPrice
            )}

            {renderDropdownRow(
              t('filter.to'),
              'maxPrice',
              formatPriceText(maxPrice),
              priceToOptions,
              (val) => {
                const newMax = val;
                const newMin = newMax !== null && minPrice > newMax ? newMax : minPrice;
                onChangePrice(newMin, newMax);
              },
              maxPrice
            )}
          </div>
        </div>

        {/* Spacing */}
        <div style={{ height: 24 }} />

        {/* Đánh giá */}
        <div>
          <div
            style={{
              textAlign: 'center',
              fontWeight: 500,
              fontSize: 17,
              color: '#000000',
              marginBottom: 12,
            }}
          >
            {t('filter.rating')}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {renderDropdownRow(
              t('filter.from'),
              'minRating',
              formatStars(minRating),
              ratingFromOptions,
              (val) => {
                const newMin = val ?? 0;
                const newMax = maxRating < newMin ? newMin : maxRating;
                onChangeRating(newMin, newMax);
              },
              minRating
            )}

            {renderDropdownRow(
              t('filter.to'),
              'maxRating',
              formatStars(maxRating),
              ratingToOptions,
              (val) => {
                const newMax = val ?? 5;
                const newMin = minRating > newMax ? newMax : minRating;
                onChangeRating(newMin, newMax);
              },
              maxRating
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
