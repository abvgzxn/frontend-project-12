import { Modal, Button, TextInput, Alert } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createChannel } from '../api/chat.js';
import { useAuthStore } from '../store/AuthStoreContext.jsx';
import { useChatStore } from '../store/ChatStoreContext.jsx';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { notifications } from '@mantine/notifications';
import { cleanProfanity } from '../utils/profanityFilter.js';

const AddChannelModal = ({ opened, onClose, channels }) => {
  const token = useAuthStore((state) => state.token);
  const setActiveChannelId = useChatStore((state) => state.setActiveChannelId);
  const queryClient = useQueryClient();
  const [createError, setCreateError] = useState(null);
  const { t } = useTranslation();

  const createChannelMutation = useMutation({
  mutationFn: (channel) => { 
    return createChannel(token, channel);
    },
  });
    
    const form = useForm({
    initialValues: {
      name: '',
    },

    validate: {
    name: (value) => {
    const name = cleanProfanity(value.trim());

    if (name.length < 3 || name.length > 20) {
      return t('addChannel.nameLength');
    }

    const notUnique = channels.some(
      (channel) => channel.name.toLowerCase() === name.toLowerCase()
    )
    if (notUnique) {
      return t('addChannel.nameExists');
    }

    return null;
      },
    },
        
  });

  const handleClose = () => {
    if (createChannelMutation.isPending) {
      return;
    }

    form.reset();
    onClose();
    setCreateError(null);
  };

  const handleSubmit = async (values) => {
    if (createChannelMutation.isPending) {
      return;
    }

    const cleanedText = cleanProfanity(values.name.trim());

    const channelData = {
      name: cleanedText
    }

    setCreateError(null);

    try {
      const newChannel = await createChannelMutation.mutateAsync(channelData);
      await queryClient.invalidateQueries({ queryKey: ['channels'] })
      setActiveChannelId(newChannel.id);
      notifications.show({
      title: t('notifications.successTitle'),
      message: t('notifications.channelCreated', {
      name: newChannel.name,
      }),
        color: 'green',
      });
      form.reset()
      onClose()
    } catch (error){
      console.error('Ошибка при создании канала', error);
      setCreateError('addChannel.requestFailed')
    }
  };
  return (
    <Modal
      opened={opened}
      onClose={handleClose}
      	title={t('addChannel.title')}
      centered
      closeOnEscape={!createChannelMutation.isPending}
      closeOnClickOutside={!createChannelMutation.isPending}
      withCloseButton={!createChannelMutation.isPending}
    >
      <form onSubmit={form.onSubmit(handleSubmit)}>
      <TextInput
      label={t('addChannel.nameLabel')}
      placeholder={t('addChannel.namePlaceholder')}
      {...form.getInputProps('name')}
      autoFocus
    />
    {createError && (
    <Alert color="red" title={t('addChannel.errorTitle')}>
    {t(createError)}
     </Alert>
     )}
      <Button 
      type="button"
      onClick={handleClose}
      disabled={createChannelMutation.isPending}
      >
        {t('addChannel.close')}
      </Button>
      <Button 
      type="submit"
      loading={createChannelMutation.isPending}
      >
        {t('addChannel.submit')}
      </Button>
      </form>
    </Modal>
  );
};

export default AddChannelModal;