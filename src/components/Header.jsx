import { Link, useNavigate } from 'react-router';
import { Button, Group } from '@mantine/core';
import { useAuthStore } from '../store/authStore.js';

const Header = () => {
  const token = useAuthStore((state) => state.token);
  const logout = useAuthStore((state) => state.logout);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout()
    navigate('/login', { replace: true });
  };

  return (
    <Group justify="space-between" p="md">
      <Link to="/">Hexlet Chat</Link>

      {token && (
        <Button onClick={handleLogout}>
          Выйти
        </Button>
      )}
    </Group>
  );
};

export default Header;