import { Modal, Button, Alert } from '@mantine/core';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteChannel } from '../api/chat.js';
import { useAuthStore } from '../store/AuthStoreContext.jsx';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { notifications } from '@mantine/notifications';

const DeleteChannelModal = ({ opened, onClose, channel }) => {
  const token = useAuthStore((state) => state.token);
  const queryClient = useQueryClient();
  const [deleteError, setDeleteError] = useState(null);
  const { t } = useTranslation();

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


      notifications.show({
        title: t('notifications.successTitle'),
        message: t('notifications.channelDeleted', {
          name: channel.name,
        }),
        color: 'green',
      });

    handleClose();
  } catch (error) {
    console.error('Ошибка удаления канала:', error);
    setDeleteError('deleteChannel.requestFailed');
  }
  };
  return (
    <Modal
      opened={opened}
      onClose={handleClose}
      title={t('deleteChannel.title')}
      centered
      closeOnEscape={!deleteMutation.isPending}
      closeOnClickOutside={!deleteMutation.isPending}
      withCloseButton={!deleteMutation.isPending}
    >
      <p>
        {t('deleteChannel.confirmation', { name: channel?.name })}
      </p>
      {deleteError && (
    <Alert color="red" title={t('deleteChannel.errorTitle')}>
    {t(deleteError)}
    </Alert>
    )}
      <Button type="button" disabled={deleteMutation.isPending} onClick={handleClose}>
        {t('deleteChannel.cancel')}
      </Button>

      <Button type="button" color="red" loading={deleteMutation.isPending} onClick={handleDelete}>
        {t('deleteChannel.submit')}
      </Button>
    </Modal>
  );
};

export default DeleteChannelModal;