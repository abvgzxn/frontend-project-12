import { TextInput, PasswordInput, Button, Stack, Alert } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useNavigate, Link } from 'react-router';
import { login } from '../api/auth.js';
import { useAuthStore } from '../store/authStore.js';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

const LoginPage = () => {
  const [authError, setAuthError] = useState(null);
  const { t } = useTranslation();
  const navigate = useNavigate();
  
  const setToken = useAuthStore((state) => state.setToken);
  const setUsername = useAuthStore((state) => state.setUsername);

  const form = useForm({
    initialValues: {
      username: '',
      password: '',
    },
  });

  const handleSubmit = async (values) => {
    setAuthError(null);
    try {
      const responseData = await login(values);

      if (!responseData.token) {
        throw new Error('Токен не найден в ответе сервера');
      }

      setToken(responseData.token);
      setUsername(values.username);

      navigate('/');
    } catch (error) {
      console.error(`Ошибка авторизации`, error);
      setAuthError('login.invalidCredentials');
    }
  };

  return (
    <form onSubmit={form.onSubmit(handleSubmit)}>
      <Stack>
        <TextInput
          label={t('login.username')}
          placeholder={t('login.usernamePlaceholder')}
          {...form.getInputProps('username')}
        />

        <PasswordInput
          label={t('login.password')}
          placeholder={t('login.passwordPlaceholder')}
          {...form.getInputProps('password')}
        />

        {authError && (
          <Alert color="red" title={t('login.errorTitle')}>
            {t(authError)}
          </Alert>
        )}

        <Button type="submit">{t('login.submit')}</Button>
        <p>
          {t('login.noAccount')} <Link to="/signup">{t('login.signup')}</Link>
        </p>
      </Stack>
    </form>
  );
};

export default LoginPage;
