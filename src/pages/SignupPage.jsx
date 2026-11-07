import { TextInput, PasswordInput, Button, Stack, Alert } from '@mantine/core';
import { useForm, hasLength } from '@mantine/form';
import { useState } from 'react';
import { useNavigate } from 'react-router';
import { signup } from '../api/auth.js';
import { useAuthStore } from '../store/authStore.js';

const SignupPage = () => {
const form = useForm({
  initialValues: {
    username: '',
    password: '',
    confirmPassword: '',
  },

  validate: {
    username: hasLength(
      { min: 3, max: 20 },
      'Имя пользователя должно содержать от 3 до 20 символов'
    ),

    password: hasLength(
      { min: 6 },
      'Пароль должен содержать минимум 6 символов'
    ),

    confirmPassword: (value, values) => {
      if (!value) {
        return 'Подтвердите пароль';
      }

      return value === values.password
        ? null
        : 'Введённые пароли не совпадают';
    },
  },
});

const navigate = useNavigate();

const setToken = useAuthStore((state) => state.setToken);
const setUsername = useAuthStore((state) => state.setUsername);

const [signupError, setSignupError] = useState(null);
const [isSubmitting, setIsSubmitting] = useState(false);

const handleSubmit = async (values) => {
  if (isSubmitting) {
    return;
  }

  setSignupError(null);
  setIsSubmitting(true);

  const credentials = {
    username: values.username.trim(),
    password: values.password,
  };

  try {
    const response = await signup(credentials)
    if (!response.token){
      throw new Error ('Сервер не отвечает');
    }

    setToken(response.token)
    setUsername(credentials.username)
    
    navigate('/');
  } catch (error) {
    console.error('Ошибка при регистрации:', error)
    setSignupError(error.message)
  } finally {
    setIsSubmitting(false);
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

      <PasswordInput
      label="Повторите пароль"
      placeholder="Введите пароль ещё раз"
      {...form.getInputProps('confirmPassword')}
      />
    {signupError && (
     <Alert color="red" title="Ошибка регистрации">
     {signupError}
     </Alert>
    )}
        <Button type="submit" loading={isSubmitting}>
          Зарегистрироваться
        </Button>
      </Stack>
    </form>
  );
};

export default SignupPage;