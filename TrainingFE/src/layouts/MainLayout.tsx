import React, { useState } from 'react';
import { Layout, Menu, Avatar, Space, Typography } from 'antd';
import { useNavigate, useLocation } from 'react-router-dom';
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
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const getSelectedKey = () => {
    if (location.pathname.startsWith('/cart')) return 'cart';
    if (location.pathname.startsWith('/profile')) return 'profile';
    return 'shop';
  };

  const menuItems = [
    {
      key: 'shop',
      icon: <ShopOutlined style={{ fontSize: 24 }} />,
      label: <span style={{ fontSize: 18, fontWeight: 500 }}>Shop</span>,
    },
    {
      key: 'cart',
      icon: <ShoppingCartOutlined style={{ fontSize: 24 }} />,
      label: <span style={{ fontSize: 18, fontWeight: 500 }}>Cart</span>,
    },
    {
      key: 'profile',
      icon: <UserOutlined style={{ fontSize: 24 }} />,
      label: <span style={{ fontSize: 18, fontWeight: 500 }}>My Profile</span>,
    },
  ];

  const handleMenuClick = (key: string) => {
    if (key === 'shop') navigate('/shop');
    if (key === 'cart') navigate('/cart');
    if (key === 'profile') navigate('/profile');
  };

  return (
    <Layout
      style={{
        width: '100%',
        maxWidth: 1694,
        minHeight: '100vh',
        margin: '0 auto',
        background: '#ffffff',
      }}
    >
      <Header
        style={{
          width: '100%',
          height: 68,
          background: '#C6E5F4',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '0 32px',
          borderBottom: '1px solid #000000',
          position: 'sticky',
          top: 0,
          zIndex: 100,
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
            }}
          >
            Mobile Shopping
          </Title>
        </Space>

        <Avatar
          size={44}
          src={userAvatar || 'https://dummyjson.com/icon/emilys/128'}
          icon={<UserOutlined style={{ fontSize: 22 }} />}
          onClick={() => navigate('/profile')}
          style={{
            backgroundColor: '#ffffff',
            cursor: 'pointer',
            border: '2px solid #0093E9',
          }}
        />
      </Header>

      <Layout style={{ minHeight: 'calc(100vh - 68px)', background: '#ffffff' }}>
        <Sider
          trigger={null}
          collapsible
          collapsed={collapsed}
          theme="light"
          width={243}
          style={{
            background: '#ffffff',
            borderRight: '1px solid #000000',
            borderLeft: '1px solid #000000',
            borderBottom: '1px solid #000000',
          }}
        >
          <div
            onClick={() => setCollapsed(!collapsed)}
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '12px 18px',
              borderBottom: '1px solid #000000',
              cursor: 'pointer',
              background: '#ffffff',
              userSelect: 'none',
            }}
          >
            {!collapsed && (
              <span style={{ fontSize: 18, fontWeight: 500, color: '#000000' }}>
                Menu
              </span>
            )}
            <MenuOutlined style={{ fontSize: 20, color: '#000000', marginLeft: collapsed ? 12 : 0 }} />
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

        <Content
          style={{
            padding: '32px 40px',
            background: '#ffffff',
            overflow: 'auto',
          }}
        >
          {children}
        </Content>
      </Layout>
    </Layout>
  );
};

export default MainLayout;
