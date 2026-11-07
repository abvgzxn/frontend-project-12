import { Modal, Button, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { renameChannel } from '../api/chat.js';
import { useAuthStore } from '../store/authStore.js';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { notifications } from '@mantine/notifications';
import { cleanProfanity } from '../utils/profanityFilter.js';

const RenameChannelForm = ({
  channel,
  channels,
  onClose,
  onPendingChange,
}) => {
  const token = useAuthStore((state) => state.token);
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  const renameMutation = useMutation({
    mutationFn: (data) => renameChannel(token, channel.id, data),
  });

  const form = useForm({
    initialValues: {
      name: channel.name,
    },

    validate: {
      name: (value) => {
        const name = cleanProfanity(value.trim());

        if (name.length < 3 || name.length > 20) {
          return t('renameChannel.nameLength');
        }

        const notUnique = channels.some(
          (item) =>
            item.id !== channel.id
            && item.name.toLowerCase() === name.toLowerCase()
        );

        if (notUnique) {
          return t('renameChannel.nameExists');
        }

        return null;
      },
    },
  });

  const handleSubmit = async (values) => {
    if (renameMutation.isPending) {
      return;
    }

    const name = cleanProfanity(values.name.trim());

    try {
      onPendingChange(true);

      await renameMutation.mutateAsync({ name });

      await queryClient.invalidateQueries({
        queryKey: ['channels'],
      });

      notifications.show({
        title: t('notifications.successTitle'),
        message: t('notifications.channelRenamed', { name }),
        color: 'green',
      });

      onClose();
    } catch (error) {
      console.error('Ошибка при переименовании канала:', error);
      form.setFieldError(
        'name',
        t('renameChannel.requestFailed')
      );
    } finally {
      onPendingChange(false);
    }
  };

  return (
    <form onSubmit={form.onSubmit(handleSubmit)}>
      <TextInput
        label={t('renameChannel.nameLabel')}
        placeholder={t('renameChannel.namePlaceholder')}
        {...form.getInputProps('name')}
        autoFocus
      />

      <Button
        type="button"
        onClick={onClose}
        disabled={renameMutation.isPending}
      >
        {t('renameChannel.cancel')}
      </Button>

      <Button
        type="submit"
        loading={renameMutation.isPending}
      >
        {t('renameChannel.submit')}
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
  const { t } = useTranslation();

  return (
    <Modal
      opened={opened}
      onClose={() => {
        if (!isPending) {
          onClose();
        }
      }}
      title={t('renameChannel.title')}
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
