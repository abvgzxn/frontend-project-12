import { TextInput, PasswordInput, Button, Stack, Alert } from '@mantine/core';
import { useForm, hasLength } from '@mantine/form';
import { useState } from 'react';
import { useNavigate } from 'react-router';
import { signup } from '../api/auth.js';
import { useAuthStore } from '../store/authStore.js';
import { useTranslation } from 'react-i18next';

const SignupPage = () => {
const { t } = useTranslation();
const form = useForm({
  initialValues: {
    username: '',
    password: '',
    confirmPassword: '',
  },

  validate: {
    username: hasLength(
      { min: 3, max: 20 },
      t('signup.usernameLength')
    ),

    password: hasLength(
      { min: 6 },
      t('signup.passwordLength')
    ),

    confirmPassword: (value, values) => {
      if (!value) {
        return t('signup.confirmRequired');
      }

      return value === values.password
        ? null
        : t('signup.passwordMismatch');
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
    throw new Error('Сервер не вернул токен');
    }

    setToken(response.token)
    setUsername(credentials.username)
    
    navigate('/');
  } catch (error) {
    console.error('Ошибка при регистрации:', error)
    setSignupError(
        error.status === 409
      ? 'signup.usernameExists'
      : 'signup.requestFailed'
    );
  } finally {
    setIsSubmitting(false);
  }
};

  return (
    <form onSubmit={form.onSubmit(handleSubmit)}>
      <Stack>
      <TextInput
      label={t('signup.username')}
      placeholder={t('signup.usernamePlaceholder')}
      {...form.getInputProps('username')}
      />

      <PasswordInput
      label={t('signup.password')}
      placeholder={t('signup.passwordPlaceholder')}
      {...form.getInputProps('password')}
      />

      <PasswordInput
      label={t('signup.confirmPassword')}
      placeholder={t('signup.confirmPasswordPlaceholder')}
      {...form.getInputProps('confirmPassword')}
      />
    {signupError && (
     <Alert color="red" title={t('signup.errorTitle')}>
     {t(signupError)}
     </Alert>
    )}
        <Button type="submit" loading={isSubmitting}>
          {t('signup.submit')}
        </Button>
      </Stack>
    </form>
  );
};

export default SignupPage;