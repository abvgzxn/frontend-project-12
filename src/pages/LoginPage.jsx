import { TextInput, PasswordInput, Button, Stack } from '@mantine/core';
import { useForm } from '@mantine/form';

const LoginPage = () => {
  const form = useForm({
    initialValues: {
    username: '',
    password: '',
    },
  });

  return (
<form onSubmit={(event) => event.preventDefault()}>
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

    <Button type="submit">Войти</Button>
  </Stack>
</form>
  );
};

export default LoginPage;