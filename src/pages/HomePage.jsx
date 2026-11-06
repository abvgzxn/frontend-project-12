import { useState, useEffect } from 'react';
import { useAuthStore } from '../store/authStore.js';
import { getChannels, getMessages, sendMessage } from '../api/chat.js';
import { useChatStore } from '../store/chatStore.js';
import { AppShell, Button, TextInput, Alert } from '@mantine/core';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

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

  const handleConnect = () => {
    queryClient.invalidateQueries({
      queryKey: ['messages']
    });
  };

  socket.on('connect', handleConnect);
  socket.on('newMessage', handleNewMessage);

  return () => {
    socket.off('newMessage', handleNewMessage);
    socket.off('connect', handleConnect);
  };
}, [socket, queryClient]);

  const messageMutation = useMutation({
  mutationFn: (message) => sendMessage(token, message),
  });

  const [text, setText] = useState('');
  const [sendError, setSendError] = useState(null);

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
      navbar={{ width: 250, breakpoint: 'sm' }}
      padding="md"
    >
        <AppShell.Navbar p="md">
          <h2>Каналы</h2>
      <ul>
        {channels.map((channel) => (
          <li key={channel.id}>
            <Button 
            type="button" 
            variant={channel.id === selectedChannelId ? 'filled' : 'subtle'}
             onClick={() => setActiveChannelId(channel.id)}
          >
           # {channel.name}
          </Button>
          </li>
        ))}
      </ul>
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
        <TextInput
      value={text}
      onChange={(event) => setText(event.currentTarget.value)}
      placeholder='Введите текст...' />
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
    </AppShell>
  );
};

export default HomePage;