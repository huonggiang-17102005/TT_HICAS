import React, { useEffect, useState } from 'react';
import { Typography, Spin, Avatar, Select, Input, message } from 'antd';
import { UserOutlined, CalendarOutlined } from '@ant-design/icons';
import { userService, type IUserProfile } from '../../services/userService.ts';

const { Title, Text } = Typography;

export const ProfilePage: React.FC = () => {
  const [user, setUser] = useState<IUserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        setLoading(true);
        const data = await userService.getUserProfile(1);
        setUser(data);
      } catch {
        message.error('Không thể tải thông tin cá nhân!');
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '100px 0' }}>
        <Spin size="large" tip="Đang tải thông tin cá nhân..." />
      </div>
    );
  }

  return (
    <div style={{ background: '#ffffff', minHeight: '100%', paddingLeft: 8 }}>
      <Title
        level={2}
        style={{
          margin: 0,
          fontWeight: 800,
          fontSize: 28,
          color: '#000000',
          marginBottom: 40,
        }}
      >
        My Profile
      </Title>

      <div style={{ display: 'flex', alignItems: 'center', gap: 48, marginBottom: 50 }}>
        <Avatar
          size={120}
          src={user?.image}
          icon={<UserOutlined />}
          style={{
            backgroundColor: '#ffffff',
            border: '2px solid #000000',
            boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
          }}
        />

        <div>
          <Title level={2} style={{ margin: 0, fontWeight: 800, fontSize: 32, color: '#000000' }}>
            {user ? `${user.firstName.toUpperCase()} ${user.lastName.toUpperCase()}` : 'MR. USER'}
          </Title>

          <Text
            style={{
              fontSize: 20,
              color: '#333333',
              display: 'block',
              marginTop: 14,
            }}
          >
            Email: {user?.email || 'user@gmail.com'}
          </Text>
        </div>
      </div>

      <div style={{ maxWidth: 650, display: 'flex', flexDirection: 'column', gap: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Text strong style={{ width: 180, fontSize: 16, color: '#000000' }}>
            Date of birth:
          </Text>
          <div
            style={{
              width: 180,
              borderBottom: '1px solid #000000',
              paddingBottom: 4,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <span style={{ fontSize: 16, color: '#000000' }}>
              {user?.birthDate || '01/01/2018'}
            </span>
            <CalendarOutlined style={{ color: '#000000', fontSize: 18 }} />
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Text strong style={{ width: 180, fontSize: 16, color: '#000000' }}>
            Sex:
          </Text>
          <div style={{ flex: 1 }}>
            <Select
              defaultValue={user?.gender === 'female' ? 'Female' : 'Male'}
              bordered={false}
              style={{ width: 120, padding: 0, fontSize: 16 }}
              options={[
                { value: 'Male', label: 'Male' },
                { value: 'Female', label: 'Female' },
                { value: 'Other', label: 'Other' },
              ]}
            />
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Text strong style={{ width: 180, fontSize: 16, color: '#000000' }}>
            Address Company:
          </Text>
          <div style={{ flex: 1, borderBottom: '1px solid #000000' }}>
            <Input
              bordered={false}
              defaultValue={
                user?.company?.address?.address
                  ? `${user.company.address.address}, ${user.company.address.city}`
                  : '15, Duy Tan, Dich Vong Hau, Cau Giay, Ha Noi'
              }
              style={{ padding: '4px 0', fontSize: 16, color: '#000000' }}
            />
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Text strong style={{ width: 180, fontSize: 16, color: '#000000' }}>
            Address Home:
          </Text>
          <div style={{ flex: 1, borderBottom: '1px solid #000000' }}>
            <Input
              bordered={false}
              defaultValue={
                user?.address?.address
                  ? `${user.address.address}, ${user.address.city}`
                  : '15, Duy Tan, Dich Vong Hau, Cau Giay, Ha Noi'
              }
              style={{ padding: '4px 0', fontSize: 16, color: '#000000' }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
