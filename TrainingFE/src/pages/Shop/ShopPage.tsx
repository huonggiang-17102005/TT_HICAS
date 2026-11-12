import React, { useState, useMemo } from 'react';
import { Row, Col, Input, Spin, Typography, Space, Empty, Popover } from 'antd';
import { SearchOutlined, FilterFilled } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { ProductCard } from '../../components/shop/ProductCard.tsx';
import { ProductFilter } from '../../components/shop/ProductFilter.tsx';
import { useProducts, useSearchProducts } from '../../hooks/useProducts.ts';

const { Title, Text } = Typography;

interface ShopPageProps {
  onSelectProduct?: (id: number) => void;
}

export const ShopPage: React.FC<ShopPageProps> = ({ onSelectProduct }) => {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [activeSearch, setActiveSearch] = useState<string>('');

  const { data: defaultProducts = [], isLoading: loadingDefault } = useProducts();
  const { data: searchProducts = [], isLoading: loadingSearch } = useSearchProducts(activeSearch);

  const products = activeSearch ? searchProducts : defaultProducts;
  const loading = activeSearch ? loadingSearch : loadingDefault;

  const [filterOpen, setFilterOpen] = useState<boolean>(false);
  const [minPrice, setMinPrice] = useState<number>(0);
  const [maxPrice, setMaxPrice] = useState<number | null>(10000000);
  const [minRating, setMinRating] = useState<number>(0);
  const [maxRating, setMaxRating] = useState<number>(5);

  const filteredProducts = useMemo(() => {
    return products.filter((item) => {
      const priceVND = Math.round(item.price * 25000);
      const passMinPrice = priceVND >= minPrice;
      const passMaxPrice = maxPrice === null || priceVND <= maxPrice;
      const passMinRating = item.rating >= minRating;
      const passMaxRating = item.rating <= maxRating;
      return passMinPrice && passMaxPrice && passMinRating && passMaxRating;
    });
  }, [products, minPrice, maxPrice, minRating, maxRating]);

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
        {t('shop.title')}
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
        <Text style={{ fontSize: 18, color: '#333333' }}>{t('common.shop')}</Text>

        <Space size={16} align="center">
          <Input
            placeholder={t('shop.searchPlaceholder')}
            value={searchTerm}
            suffix={<SearchOutlined style={{ fontSize: 20, color: '#000000' }} />}
            onPressEnter={(e) => setActiveSearch((e.target as HTMLInputElement).value.trim())}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              if (!e.target.value.trim()) {
                setActiveSearch('');
              }
            }}
            style={{
              width: 280,
              height: 42,
              borderRadius: 6,
              border: '1px solid #d9d9d9',
              fontSize: 15,
            }}
          />
          <Popover
            content={
              <ProductFilter
                minPrice={minPrice}
                maxPrice={maxPrice}
                minRating={minRating}
                maxRating={maxRating}
                onChangePrice={(min, max) => {
                  setMinPrice(min);
                  setMaxPrice(max);
                }}
                onChangeRating={(min, max) => {
                  setMinRating(min);
                  setMaxRating(max);
                }}
              />
            }
            trigger="click"
            open={filterOpen}
            onOpenChange={setFilterOpen}
            placement="bottomRight"
            arrow={false}
            styles={{
              content: { padding: 0 },
            }}
            overlayInnerStyle={{
              padding: 0,
              borderRadius: 8,
              border: 'none',
              background: 'transparent',
              boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)',
            }}
          >
            <FilterFilled
              style={{
                fontSize: 28,
                color: '#000000',
                cursor: 'pointer',
                transition: 'transform 0.2s',
              }}
            />
          </Popover>
        </Space>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '80px 0' }}>
          <Spin size="large" tip={t('shop.loading')} />
        </div>
      ) : filteredProducts.length === 0 ? (
        <Empty description={t('shop.emptyFilter')} />
      ) : (
        <Row gutter={[32, 28]}>
          {filteredProducts.map((item) => (
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
