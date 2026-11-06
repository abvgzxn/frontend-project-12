import { Modal, Button, Alert } from '@mantine/core';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteChannel } from '../api/chat.js';
import { useAuthStore } from '../store/authStore.js';
import { useState } from 'react';

const DeleteChannelModal = ({ opened, onClose, channel }) => {
  const token = useAuthStore((state) => state.token);
  const queryClient = useQueryClient();
  const [deleteError, setDeleteError] = useState(null);

  const deleteMutation = useMutation({
  mutationFn: (channelId) => {
    return deleteChannel(token, channelId)
  },
  });

  const handleClose = () => {
  setDeleteError(null);
  onClose();
  };

  const handleDelete = async () => {
  if (!channel || !channel.removable || deleteMutation.isPending) {
    return;
  }
    setDeleteError(null);
  try {
    await deleteMutation.mutateAsync(channel.id)

    await queryClient.invalidateQueries({
        queryKey: ['channels'],
      });

    await queryClient.invalidateQueries({
        queryKey: ['messages'],
      });

    handleClose();
  } catch (error) {
    console.error('Ошибка удаления канала:', error);
    setDeleteError('Не удалось удалить канал. Попробуйте ещё раз.');
  }
  };
  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title="Удалить канал"
      centered
      closeOnEscape={!deleteMutation.isPending}
      closeOnClickOutside={!deleteMutation.isPending}
      withCloseButton={!deleteMutation.isPending}
    >
      <p>
        Вы уверены, что хотите удалить канал «{channel?.name}»?
      </p>
      {deleteError && (
    <Alert color="red" title="Ошибка удаления">
    {deleteError}
    </Alert>
    )}
      <Button type="button" disabled={deleteMutation.isPending} onClick={onClose}>
        Отмена
      </Button>

      <Button type="button" color="red" loading={deleteMutation.isPending} onClick={handleDelete}>
        Удалить
      </Button>
    </Modal>
  );
};

export default DeleteChannelModal;