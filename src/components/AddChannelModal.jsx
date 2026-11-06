import { Modal, Button, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createChannel } from '../api/chat.js';
import { useAuthStore } from '../store/authStore.js';
import { useChatStore } from '../store/chatStore.js';

const AddChannelModal = ({ opened, onClose, channels }) => {
  const token = useAuthStore((state) => state.token);
  const setActiveChannelId = useChatStore((state) => state.setActiveChannelId);
  const queryClient = useQueryClient();

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
    const name = value.trim();

    if (name.length < 3 || name.length > 20) {
      return 'Название должно содержать от 3 до 20 символов';
    }

    const notUnique = channels.some(
      (channel) => channel.name.toLowerCase() === name.toLowerCase()
    )
    if (notUnique) {
      return 'Канал с таким названием уже существует'
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
  };

  const handleSubmit = async (values) => {
    const channelData = {
      name: values.name.trim()
    }

    try {
      const newChannel = await createChannelMutation.mutateAsync(channelData);
      await queryClient.invalidateQueries({ queryKey: ['channels'] })
      setActiveChannelId(newChannel.id);
      form.reset()
      onClose()
    } catch (error){
      console.error('Ошибка при создании канала', error);
    }
  };
  return (
    <Modal
      opened={opened}
      onClose={handleClose}
      title="Добавить канал"
      centered
      closeOnEscape={!createChannelMutation.isPending}
      closeOnClickOutside={!createChannelMutation.isPending}
      withCloseButton={!createChannelMutation.isPending}
    >
      <form onSubmit={form.onSubmit(handleSubmit)}>
      <TextInput
      label="Название канала"
      placeholder="Введите название"
      {...form.getInputProps('name')}
      autoFocus
    />
      <Button 
      type="button"
      onClick={handleClose}
      disabled={createChannelMutation.isPending}
      >
        Закрыть
      </Button>
      <Button 
      type="submit"
      loading={createChannelMutation.isPending}
      >
        Создать канал
      </Button>
      </form>
    </Modal>
  );
};

export default AddChannelModal;