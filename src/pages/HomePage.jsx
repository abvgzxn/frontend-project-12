import { useState, useEffect } from 'react';
import { useAuthStore } from '../store/authStore.js';
import { getChannels, getMessages, sendMessage } from '../api/chat.js';
import { useChatStore } from '../store/chatStore.js';
import { AppShell, Button, Textarea, Alert, Menu, Group } from '@mantine/core';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import AddChannelModal from '../components/AddChannelModal.jsx';
import RenameChannelModal from '../components/RenameChannelModal.jsx';
import DeleteChannelModal from '../components/DeleteChannelModal.jsx';
import Header from '../components/Header.jsx';

const HomePage = ({ socket }) => {
  const token = useAuthStore((state) => state.token);
  const queryClient = useQueryClient();
  const username = useAuthStore((state) => state.username);

  useEffect(() => {
  const handleNewMessage = (message) => {
    queryClient.setQueryData(['messages'], (oldMessages = []) => {
      const isDuplicated = oldMessages.some((msg) => msg.id === message.id);
      if (isDuplicated) {
        return oldMessages
      }
      return [...oldMessages, message];
    });
  };

  const handleRenameChannel = (updatedChannel) => {
  queryClient.setQueryData(['channels'], (oldChannels = []) => {
    return oldChannels.map((item) => 
      item.id === updatedChannel.id 
        ? { ...item, name: updatedChannel.name } 
        : item
        );
      });
    };

  const handleNewChannel = (channel) => {
    queryClient.setQueryData(['channels'], (oldChannels = []) => {
    const isDuplicated = oldChannels.some((chnl) => chnl.id === channel.id);
    if (isDuplicated) {
      return oldChannels
    }
    return [...oldChannels, channel];
    })
  };

  const handleRemoveChannel = (removedChannel) => {
  queryClient.setQueryData(['channels'], (oldChannels = []) => {
    return oldChannels.filter(
      (channel) => channel.id !== removedChannel.id
    );
  });

  queryClient.setQueryData(['messages'], (oldMessages = []) => {
    return oldMessages.filter(
      (message) => message.channelId !== removedChannel.id
    );
  });

  const currentChannelId = useChatStore.getState().activeChannelId;

  if (currentChannelId === removedChannel.id) {
    const currentChannels = queryClient.getQueryData(['channels']);

    const generalChannel = currentChannels?.find(
      (channel) => channel.name === 'general'
    );

    if (generalChannel) {
      useChatStore.getState().setActiveChannelId(generalChannel.id);
    }
  }
  };

  const handleConnect = () => {
    queryClient.invalidateQueries({
      queryKey: ['messages'],
    });

    queryClient.invalidateQueries({
      queryKey: ['channels'],
    });
  };

  socket.on('connect', handleConnect);
  socket.on('newMessage', handleNewMessage);
  socket.on('newChannel', handleNewChannel);
  socket.on('renameChannel', handleRenameChannel);
  socket.on('removeChannel', handleRemoveChannel);

  return () => {
    socket.off('newMessage', handleNewMessage);
    socket.off('connect', handleConnect);
    socket.off('newChannel', handleNewChannel);
    socket.off('renameChannel', handleRenameChannel);
    socket.off('removeChannel', handleRemoveChannel);
  };
}, [socket, queryClient]);

  const messageMutation = useMutation({
  mutationFn: (message) => sendMessage(token, message),
  });

  const [text, setText] = useState('');
  const [sendError, setSendError] = useState(null);
  const [addChannelOpened, setAddChannelOpened] = useState(false);
  const [channelToRename, setChannelToRename] = useState(null);
  const [channelToDelete, setChannelToDelete] = useState(null);

  const activeChannelId = useChatStore((state) => state.activeChannelId);
  const setActiveChannelId = useChatStore((state) => state.setActiveChannelId);

  const { data: channels = [], isLoading: channelsLoading, isError: channelsError, } = useQuery({
    queryKey: ['channels'],
    queryFn: () => getChannels(token),
    enabled: Boolean(token),
  });

  const { data: messages = [], isLoading: messagesLoading, isError: messagesError,} = useQuery({
  queryKey: ['messages'],
  queryFn: () => getMessages(token),
  enabled: Boolean(token)
});

  const selectedChannel = channels.find(
    (channel) => channel.id === activeChannelId
  ) ?? channels[0];

  const selectedChannelId = selectedChannel?.id;

  const visibleMessages = messages.filter((message) => {
  return message.channelId === selectedChannelId;
  });

  const handleSendMessage = async () => {
  if (messageMutation.isPending || !text.trim() || !selectedChannelId || !username) {
  return;
  }

  const message = {
    body: text.trim(),
    channelId: selectedChannelId,
    username,
  };

  setSendError(null)

  try {
  await messageMutation.mutateAsync(message);
  setText('');
  } catch (error) {
    console.error(`Не удалось отправить сообщение`, error);
    setSendError('Не удалось отправить сообщение. Попробуйте ещё раз.')
  }
};

  if (channelsLoading || messagesLoading) {
    return <p>Загрузка данных чата...</p>;
  }

  if (channelsError || messagesError) {
    return <p>Не удалось загрузить данные чата</p>;
  }

  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{ width: 250, breakpoint: 'sm' }}
      padding="md"
    >
    <AppShell.Header>
    <Header />
    </AppShell.Header>
    <AppShell.Navbar p="md">
      <h2>Каналы</h2>
      <ul style={{ 
      listStyle: 'none',
      margin: 0,
      padding: 0,
      width: '100%',
       }}>
  {channels.map((channel) => (
      <li
  key={channel.id}
  style={{ listStyle: 'none',
   minWidth: 0, 
   width: '100%',
   marginBottom: '4px', }}
>
  <Group gap="xs" wrap="nowrap"  justify="space-between" style={{ width: '100%', minWidth: 0 }}>
    <Button
      type="button"
      variant={channel.id === selectedChannelId ? 'filled' : 'subtle'}
      onClick={() => setActiveChannelId(channel.id)}
      style={{ flex: 1, minWidth: 0 }}
      justify="flex-start"
      styles={{
        label: {
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
          display: 'block',
        },
      }}
    >
      # {channel.name}
    </Button>

    {channel.removable && (
      <Menu>
        <Menu.Target>
          <Button
            type="button"
            variant="subtle"
            aria-label={`Управление каналом ${channel.name}`}
            style={{ flexShrink: 0 }}
            w={36}
            px={0}
          >
            ⋮
          </Button>
        </Menu.Target>

        <Menu.Dropdown>
          <Menu.Item onClick={() => setChannelToRename(channel)}>
            Переименовать
          </Menu.Item>

          <Menu.Item
            color="red"
            onClick={() => setChannelToDelete(channel)}
          >
            Удалить
          </Menu.Item>
        </Menu.Dropdown>
      </Menu>
      )}
      </Group>
    </li>
        ))}
      </ul>
      <Button mt="md" fullWidth onClick={() => setAddChannelOpened(true)}>
        + Добавить канал
      </Button>
      </AppShell.Navbar>
        <AppShell.Main>
      <h2># {selectedChannel?.name}</h2>
      <h2>Сообщения</h2>
      <ul>
        {visibleMessages.map((message) => (
          <li key={message.id}>
            <strong>{message.username}:</strong> {message.body}
          </li>
        ))}
      </ul>
        <Textarea
      value={text}
      onChange={(event) => setText(event.currentTarget.value)}
      placeholder='Введите сообщение...' 
      aria-label="Текст сообщения"
      autosize
      minRows={1}
      maxRows={6}
      onKeyDown={(event) => {
        if (
          event.key === 'Enter'
          && !event.shiftKey
          && !event.nativeEvent.isComposing
        ) {
          event.preventDefault();
          handleSendMessage();
        }
      }}
      />
      {sendError && (
        <Alert color="red" title="Ошибка отправки">
          {sendError}
        </Alert>
      )}
      <Button 
      type='button'
      onClick={handleSendMessage}
      loading={messageMutation.isPending}
      disabled={!text.trim() || !username || !selectedChannelId} >Отправить</Button>
      </AppShell.Main>
      <AddChannelModal
        opened={addChannelOpened}
        onClose={() => setAddChannelOpened(false)}
        channels={channels}
      />
      <RenameChannelModal
        opened={channelToRename !== null}
        onClose={() => setChannelToRename(null)}
        channel={channelToRename}
        channels={channels}
      />
      <DeleteChannelModal
        opened={channelToDelete !== null}
        onClose={() => setChannelToDelete(null)}
        channel={channelToDelete}
      />
    </AppShell>
  );
};

export default HomePage;