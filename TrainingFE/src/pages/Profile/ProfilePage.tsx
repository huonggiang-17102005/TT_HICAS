import React, { useEffect, useState } from 'react';
import { Typography, Spin, Avatar, Select, Input, message } from 'antd';
import { UserOutlined, CalendarOutlined } from '@ant-design/icons';
import { useTranslation } from '../../i18n/index.ts';
import { userService, type IUserProfile } from '../../services/userService.ts';

const { Title, Text } = Typography;

export const ProfilePage: React.FC = () => {
  const { t } = useTranslation();
  const [user, setUser] = useState<IUserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        setLoading(true);
        const savedAuth = localStorage.getItem('auth_user');
        const userId = savedAuth ? JSON.parse(savedAuth).id : 1;

        const data = await userService.getUserProfile(userId);
        setUser(data);
      } catch {
        message.error(t('profile.loadError'));
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [t]);

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '100px 0' }}>
        <Spin size="large" tip={t('profile.loading')} />
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
        {t('profile.title')}
      </Title>

      <div style={{ display: 'flex', alignItems: 'center', gap: 48, marginBottom: 50, flexWrap: 'wrap' }}>
        <Avatar
          size={120}
          src={user?.image}
          icon={<UserOutlined />}
          style={{
            backgroundColor: '#ffffff',
            border: '2px solid #0093E9',
            boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
          }}
        />

        <div>
          <Title level={2} style={{ margin: 0, fontWeight: 800, fontSize: 32, color: '#000000' }}>
            {user ? `${user.firstName.toUpperCase()} ${user.lastName.toUpperCase()}` : 'MR. USER'}
          </Title>

          <Text
            style={{
              fontSize: 18,
              color: '#64748b',
              display: 'block',
              marginTop: 10,
            }}
          >
            {t('profile.email')} {user?.email || 'user@gmail.com'}
          </Text>
        </div>
      </div>

      <div style={{ maxWidth: 650, display: 'flex', flexDirection: 'column', gap: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Text strong style={{ width: 180, fontSize: 16, color: '#334155' }}>
            {t('profile.dob')}
          </Text>
          <div
            style={{
              width: 200,
              borderBottom: '1px solid #cbd5e1',
              paddingBottom: 4,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <span style={{ fontSize: 16, color: '#000000' }}>
              {user?.birthDate || '01/01/2000'}
            </span>
            <CalendarOutlined style={{ color: '#01AEEF', fontSize: 18 }} />
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Text strong style={{ width: 180, fontSize: 16, color: '#334155' }}>
            {t('profile.gender')}
          </Text>
          <div style={{ flex: 1 }}>
            <Select
              defaultValue={user?.gender === 'female' ? 'Female' : 'Male'}
              variant="borderless"
              style={{ width: 130, padding: 0, fontSize: 16 }}
              options={[
                { value: 'Male', label: t('profile.male') },
                { value: 'Female', label: t('profile.female') },
                { value: 'Other', label: t('profile.other') },
              ]}
            />
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Text strong style={{ width: 180, fontSize: 16, color: '#334155' }}>
            {t('profile.companyAddress')}
          </Text>
          <div style={{ flex: 1, borderBottom: '1px solid #cbd5e1' }}>
            <Input
              variant="borderless"
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
          <Text strong style={{ width: 180, fontSize: 16, color: '#334155' }}>
            {t('profile.homeAddress')}
          </Text>
          <div style={{ flex: 1, borderBottom: '1px solid #cbd5e1' }}>
            <Input
              variant="borderless"
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
