import { TextInput, PasswordInput, Button, Stack, Alert } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useNavigate } from 'react-router';
import { login } from '../api/auth.js';
import { useAuthStore } from '../store/authStore.js';
import { useState } from 'react';

const LoginPage = () => {
  const [authError, setAuthError] = useState(null);
  const form = useForm({
    initialValues: {
    username: '',
    password: '',
    },
  });

const navigate = useNavigate();
const setToken = useAuthStore((state) => state.setToken);

const handleSubmit = async (values) => {
  setAuthError(null);
  try {
    const responseData = await login(values)

    const token = responseData.token

    if (token) {
      setToken(token)

      navigate('/');
    } else {
      throw new Error('Токен не найден в ответе сервера');
    }
  } catch (error) {
    console.error(`Неверное имя пользователя или пароль`, error);
    setAuthError('Неверное имя пользователя или пароль');
  }
};

  return (
<form onSubmit={form.onSubmit(handleSubmit)}>
  <Stack>
    <TextInput
      label="Имя пользователя"
      placeholder="Введите логин"
      {...form.getInputProps('username')}
    />

    <PasswordInput
      label="Пароль"
      placeholder="Введите пароль"
      {...form.getInputProps('password')}
    />

        {authError && (
      <Alert color="red" title="Ошибка авторизации">
        {authError}
      </Alert>
    )}

    <Button type="submit">Войти</Button>
  </Stack>
</form>
  );
};

export default LoginPage;