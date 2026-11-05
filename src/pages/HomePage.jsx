import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { useAuthStore } from '../store/authStore.js';
import { getChannels, getMessages } from '../api/chat.js';
import { useChatStore } from '../store/chatStore.js';
import { AppShell, Button, TextInput } from '@mantine/core';

const HomePage = () => {
  const token = useAuthStore((state) => state.token);

  const [text, setText] = useState('');

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

  const visibleMessages = messages.filter((message) => {
    return message.channelId === selectedChannelId;
  });

  const selectedChannel = channels.find(
    (channel) => channel.id === activeChannelId
  ) ?? channels[0];

  const selectedChannelId = selectedChannel?.id;

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
      <Button 
        disabled={!text.trim()} >Отправить</Button>
      </AppShell.Main>
    </AppShell>
  );
};

export default HomePage;