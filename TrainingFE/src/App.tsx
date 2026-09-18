import { Routes, Route, Navigate, useNavigate, useParams } from 'react-router-dom';
import { MainLayout } from './layouts/MainLayout.tsx';
import { ShopPage } from './pages/Shop/ShopPage.tsx';
import { ProductDetailPage } from './pages/Shop/ProductDetailPage.tsx';
import { CartPage } from './pages/Cart/CartPage.tsx';
import { ProfilePage } from './pages/Profile/ProfilePage.tsx';

const ProductDetailWrapper = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  return (
    <ProductDetailPage
      productId={id ? Number(id) : 1}
      onBackToShop={() => navigate('/shop')}
    />
  );
};

function App() {
  const navigate = useNavigate();

  return (
    <MainLayout>
      <Routes>
        <Route path="/" element={<Navigate to="/shop" replace />} />
        <Route path="/shop" element={<ShopPage onSelectProduct={(id) => navigate(`/product/${id}`)} />} />
        <Route path="/product/:id" element={<ProductDetailWrapper />} />
        <Route path="/cart" element={<CartPage onBackToShop={() => navigate('/shop')} />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="*" element={<Navigate to="/shop" replace />} />
      </Routes>
    </MainLayout>
  );
}

export default App;
