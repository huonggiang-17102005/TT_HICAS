import React, { useState } from 'react';
import { Form, Input, Button, Checkbox, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import logo from '../../assets/logo.png';
import loginBg from '../../assets/login.png';
import { userService } from '../../services/userService.ts';
import { useCart } from '../../hooks/useCart.ts';

export const LoginPage: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();
  const { syncCartForUser } = useCart();

  const handleLogin = async (values: { username: string; password: string; remember?: boolean }) => {
    try {
      setLoading(true);
      const res = await userService.login(values.username, values.password);
      localStorage.setItem('auth_user', JSON.stringify(res));
      localStorage.setItem('access_token', res.accessToken);
      message.success(`Xin chào, ${res.firstName} ${res.lastName}!`);
      syncCartForUser();
      navigate('/shop');
    } catch {
      message.error('Tên đăng nhập hoặc mật khẩu không đúng!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        width: '100%',
        backgroundColor: '#51A5DF',
        backgroundImage: `url(${loginBg})`,
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'bottom center',
        backgroundSize: '100% auto',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        padding: '20px 20px 80px',
      }}
    >
      <div
        style={{
          width: 96,
          height: 96,
          borderRadius: '50%',
          backgroundColor: '#ffffff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: 36,
          boxShadow: '0 4px 16px rgba(0, 0, 0, 0.12)',
        }}
      >
        <img src={logo} alt="Logo" style={{ width: 56, objectFit: 'contain' }} />
      </div>

      <div style={{ width: '100%', maxWidth: 440 }}>
        <Form
          name="loginForm"
          initialValues={{ username: 'emilys', password: 'emilyspass', remember: true }}
          onFinish={handleLogin}
          layout="vertical"
        >
          <Form.Item
            name="username"
            rules={[{ required: true, message: 'Vui lòng nhập tên đăng nhập!' }]}
            style={{ marginBottom: 20 }}
          >
            <Input
              size="large"
              placeholder="Tên đăng nhập"
              prefix={
                <div
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: '50%',
                    backgroundColor: '#51A5DF',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#ffffff',
                    marginRight: 8,
                  }}
                >
                  <UserOutlined style={{ fontSize: 16 }} />
                </div>
              }
              style={{
                height: 52,
                borderRadius: 6,
                fontSize: 16,
                border: 'none',
              }}
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' }]}
            style={{ marginBottom: 12 }}
          >
            <Input.Password
              size="large"
              placeholder="Mật khẩu"
              prefix={
                <div
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: '50%',
                    backgroundColor: '#51A5DF',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#ffffff',
                    marginRight: 8,
                  }}
                >
                  <LockOutlined style={{ fontSize: 16 }} />
                </div>
              }
              style={{
                height: 52,
                borderRadius: 6,
                fontSize: 16,
                border: 'none',
              }}
            />
          </Form.Item>

          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 24,
            }}
          >
            <Form.Item name="remember" valuePropName="checked" noStyle>
              <Checkbox style={{ color: '#ffffff', fontSize: 14 }}>Lưu đăng nhập</Checkbox>
            </Form.Item>
            <span
              style={{
                color: '#ffffff',
                cursor: 'pointer',
                fontSize: 14,
              }}
              onClick={() => message.info('Vui lòng liên hệ tổng đài 19001000 để lấy lại mật khẩu!')}
            >
              Bạn quên mật khẩu?
            </span>
          </div>

          <Form.Item style={{ marginBottom: 0 }}>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              style={{
                width: '100%',
                height: 48,
                backgroundColor: 'rgba(255, 255, 255, 0.25)',
                borderColor: '#ffffff',
                borderWidth: 1.5,
                borderRadius: 6,
                color: '#ffffff',
                fontSize: 16,
                fontWeight: 600,
                boxShadow: 'none',
              }}
            >
              Đăng nhập
            </Button>
          </Form.Item>
        </Form>
      </div>

      <div
        style={{
          position: 'absolute',
          bottom: 20,
          left: 0,
          right: 0,
          textAlign: 'center',
          color: 'rgba(255, 255, 255, 0.8)',
          fontSize: 13,
          lineHeight: 1.8,
        }}
      >
        <div>
          Nếu bạn có thắc mắc hay cần giải đáp, vui lòng liên hệ số điện thoại: <strong>19001000</strong>
        </div>
        <div>Bản quyền thuộc về AnyBim</div>
      </div>
    </div>
  );
};
