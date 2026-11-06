import { Modal, Button, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { renameChannel } from '../api/chat.js';
import { useAuthStore } from '../store/authStore.js';
import { useState } from 'react';

const RenameChannelForm = ({
  channel,
  channels,
  onClose,
  onPendingChange,
}) => {
  const token = useAuthStore((state) => state.token);
  const queryClient = useQueryClient();

  const renameMutation = useMutation({
    mutationFn: (data) => renameChannel(token, channel.id, data),
  });

  const form = useForm({
    initialValues: {
      name: channel.name,
    },

    validate: {
      name: (value) => {
        const name = value.trim();

        if (name.length < 3 || name.length > 20) {
          return 'Название должно содержать от 3 до 20 символов';
        }

        const notUnique = channels.some(
          (item) =>
            item.id !== channel.id
            && item.name.toLowerCase() === name.toLowerCase()
        );

        if (notUnique) {
          return 'Канал с таким названием уже существует';
        }

        return null;
      },
    },
  });

  const handleSubmit = async (values) => {
    if (renameMutation.isPending) {
      return;
    }

    const name = values.name.trim();

    try {
      onPendingChange(true);

      await renameMutation.mutateAsync({ name });

      await queryClient.invalidateQueries({
        queryKey: ['channels'],
      });

      onClose();
    } catch (error) {
      console.error('Ошибка при переименовании канала:', error);
      form.setFieldError(
        'name',
        'Не удалось переименовать канал. Попробуйте ещё раз.'
      );
    } finally {
      onPendingChange(false);
    }
  };

  return (
    <form onSubmit={form.onSubmit(handleSubmit)}>
      <TextInput
        label="Название канала"
        placeholder="Введите новое название"
        {...form.getInputProps('name')}
        autoFocus
      />

      <Button
        type="button"
        onClick={onClose}
        disabled={renameMutation.isPending}
      >
        Отмена
      </Button>

      <Button
        type="submit"
        loading={renameMutation.isPending}
      >
        Переименовать
      </Button>
    </form>
  );
};

const RenameChannelModal = ({
  opened,
  onClose,
  channel,
  channels,
}) => {
  const [isPending, setIsPending] = useState(false);

  return (
    <Modal
      opened={opened}
      onClose={() => {
        if (!isPending) {
          onClose();
        }
      }}
      title="Переименовать канал"
      centered
      closeOnEscape={!isPending}
      closeOnClickOutside={!isPending}
      withCloseButton={!isPending}
    >
      {opened && channel && (
        <RenameChannelForm
          key={channel.id}
          channel={channel}
          channels={channels}
          onClose={onClose}
          onPendingChange={setIsPending}
        />
      )}
    </Modal>
  );
};

export default RenameChannelModal;
