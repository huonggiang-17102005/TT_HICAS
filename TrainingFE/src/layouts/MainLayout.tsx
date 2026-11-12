import React, { useState } from 'react';
import { Layout, Menu, Avatar, Space, Typography, Select } from 'antd';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from '../i18n/index.ts';
import logo from '../assets/logo.png';
import {
  ShopOutlined,
  ShoppingCartOutlined,
  UserOutlined,
  MenuOutlined,
} from '@ant-design/icons';

const { Header, Sider, Content } = Layout;
const { Title } = Typography;

interface MainLayoutProps {
  children?: React.ReactNode;
  userAvatar?: string;
}

export const MainLayout: React.FC<MainLayoutProps> = ({
  children,
  userAvatar,
}) => {
  const { t, i18n } = useTranslation();
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const savedAuth = localStorage.getItem('auth_user');
  const currentUser = savedAuth ? JSON.parse(savedAuth) : null;
  const currentAvatar = userAvatar || currentUser?.image || 'https://dummyjson.com/icon/emilys/128';

  const getSelectedKey = () => {
    if (location.pathname.startsWith('/cart')) return 'cart';
    if (location.pathname.startsWith('/profile')) return 'profile';
    return 'shop';
  };

  const menuItems = [
    {
      key: 'shop',
      icon: <ShopOutlined style={{ fontSize: 24 }} />,
      label: <span style={{ fontSize: 18, fontWeight: 500 }}>{t('common.shop')}</span>,
    },
    {
      key: 'cart',
      icon: <ShoppingCartOutlined style={{ fontSize: 24 }} />,
      label: <span style={{ fontSize: 18, fontWeight: 500 }}>{t('common.cart')}</span>,
    },
    {
      key: 'profile',
      icon: <UserOutlined style={{ fontSize: 24 }} />,
      label: <span style={{ fontSize: 18, fontWeight: 500 }}>{t('common.profile')}</span>,
    },
  ];

  const handleMenuClick = (key: string) => {
    if (key === 'shop') navigate('/shop');
    if (key === 'cart') navigate('/cart');
    if (key === 'profile') navigate('/profile');
  };

  const handleLanguageChange = (lng: 'vi' | 'en') => {
    i18n.changeLanguage(lng);
  };

  const currentLang = i18n.language && i18n.language.startsWith('en') ? 'en' : 'vi';

  return (
    <Layout
      style={{
        width: '100%',
        height: '100vh',
        maxHeight: '100vh',
        overflow: 'hidden',
        background: '#ffffff',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* 1. Header cố định trên cùng */}
      <Header
        style={{
          width: '100%',
          height: 68,
          flexShrink: 0,
          background: '#C6E5F4',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '0 32px',
          borderBottom: '1px solid #bce1f2',
          zIndex: 100,
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
        }}
      >
        <Space
          size="middle"
          align="center"
          style={{ cursor: 'pointer' }}
          onClick={() => navigate('/shop')}
        >
          <img
            src={logo}
            alt="Logo"
            style={{
              height: 44,
              objectFit: 'contain',
              display: 'block',
            }}
          />
          <Title
            level={3}
            style={{
              margin: 0,
              color: '#000000',
              fontWeight: 700,
              fontSize: 24,
              letterSpacing: -0.3,
            }}
          >
            Mobile Shopping
          </Title>
        </Space>

        <Space size="middle" align="center">
          {/* Nút chuyển đổi đa ngôn ngữ nhỏ gọn VN / EN */}
          <Select
            value={currentLang}
            onChange={(val) => handleLanguageChange(val as 'vi' | 'en')}
            style={{ width: 72 }}
            options={[
              { value: 'vi', label: 'VN' },
              { value: 'en', label: 'EN' },
            ]}
          />

          <Avatar
            size={44}
            src={currentAvatar}
            icon={<UserOutlined style={{ fontSize: 22 }} />}
            onClick={() => navigate('/profile')}
            style={{
              backgroundColor: '#ffffff',
              cursor: 'pointer',
              border: '2px solid #0093E9',
              boxShadow: '0 2px 6px rgba(0, 147, 233, 0.2)',
            }}
          />
        </Space>
      </Header>

      {/* 2. Phần thân cố định chiều cao (100vh - 68px) */}
      <Layout
        style={{
          flex: 1,
          height: 'calc(100vh - 68px)',
          maxHeight: 'calc(100vh - 68px)',
          overflow: 'hidden',
          background: '#ffffff',
          display: 'flex',
          flexDirection: 'row',
        }}
      >
        {/* Sider cố định bên trái, không cuộn theo Content */}
        <Sider
          trigger={null}
          collapsible
          collapsed={collapsed}
          theme="light"
          width={243}
          style={{
            height: '100%',
            overflowY: 'auto',
            overflowX: 'hidden',
            background: '#ffffff',
            borderRight: '1px solid #e2e8f0',
            flexShrink: 0,
          }}
        >
          <div
            onClick={() => setCollapsed(!collapsed)}
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '12px 18px',
              borderBottom: '1px solid #e2e8f0',
              cursor: 'pointer',
              background: '#ffffff',
              userSelect: 'none',
              transition: 'background 0.2s',
            }}
          >
            {!collapsed && (
              <span style={{ fontSize: 18, fontWeight: 600, color: '#1e293b' }}>
                {t('common.menu')}
              </span>
            )}
            <MenuOutlined style={{ fontSize: 20, color: '#1e293b', marginLeft: collapsed ? 12 : 0 }} />
          </div>

          <Menu
            mode="inline"
            selectedKeys={[getSelectedKey()]}
            onClick={(e) => handleMenuClick(e.key)}
            items={menuItems}
            style={{
              borderRight: 0,
              paddingTop: 8,
            }}
          />
        </Sider>

        {/* 3. Content: NƠI DUY NHẤT CÓ THANH CUỘN (overflow-y: auto) */}
        <Content
          className="app-main-content"
          style={{
            flex: 1,
            height: '100%',
            overflowY: 'auto',
            overflowX: 'hidden',
            padding: '32px 40px',
            background: '#ffffff',
          }}
        >
          <div style={{ maxWidth: 1400, margin: '0 auto' }}>
            {children}
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default MainLayout;
