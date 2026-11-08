import App from './App.jsx';
import { BrowserRouter } from 'react-router';
import { MantineProvider } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import NetworkNotifications from './components/NetworkNotifications.jsx';
import './i18n.js';
import { createChatStore } from './store/createChatStore.js';
import { ChatStoreContext } from './store/ChatStoreContext.jsx';
import { createAuthStore } from './store/createAuthStore.js';
import { AuthStoreContext } from './store/AuthStoreContext.jsx';

const init = async (socket) => {
const queryClient = new QueryClient();
const chatStore = createChatStore();
const authStore = createAuthStore();
  return (
    <MantineProvider>
      <Notifications position="top-right" limit={3} />
      <NetworkNotifications />
      <BrowserRouter>
        <QueryClientProvider client={queryClient}>
          <ChatStoreContext.Provider value={chatStore}>
          <AuthStoreContext.Provider value={authStore}>
          <App socket={socket} />
          </AuthStoreContext.Provider>
          </ChatStoreContext.Provider>
        </QueryClientProvider>
      </BrowserRouter>
    </MantineProvider>
  );
};

export default init;