import { Link, useNavigate } from 'react-router';
import { Button, Group } from '@mantine/core';
import { useAuthStore } from '../store/authStore.js';
import { useTranslation } from 'react-i18next';

const Header = () => {
  const token = useAuthStore((state) => state.token);
  const logout = useAuthStore((state) => state.logout);
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleLogout = () => {
    logout()
    navigate('/login', { replace: true });
  };

  return (
    <Group justify="space-between" p="md">
      <Link to="/">{t('header.title')}</Link>

      {token && (
        <Button onClick={handleLogout}>
          {t('header.logout')}
        </Button>
      )}
    </Group>
  );
};

export default Header;