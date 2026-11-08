import { TextInput, PasswordInput, Button, Stack, Alert } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useNavigate, Link } from 'react-router';
import { login } from '../api/auth.js';
import { useAuthStore } from '../store/AuthStoreContext.jsx';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

const LoginPage = () => {
  const [authError, setAuthError] = useState(null);
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const setToken = useAuthStore((state) => state.setToken);
  const setUsername = useAuthStore((state) => state.setUsername);

  const form = useForm({
    initialValues: {
      username: '',
      password: '',
    },
  });

  const handleSubmit = async (values) => {
    if (isSubmitting) {
    return;
    }
    setIsSubmitting(true);
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
      if (error.status === 401) {
        setAuthError('login.invalidCredentials');
      } else {
        setAuthError('login.connectionError');
      }
      console.error(`Ошибка авторизации`, error);
    } finally {
      setIsSubmitting(false);
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

        <Button type="submit" loading={isSubmitting}>{t('login.submit')}</Button>
        <p>
          {t('login.noAccount')} <Link to="/signup">{t('login.signup')}</Link>
        </p>
      </Stack>
    </form>
  );
};

export default LoginPage;
