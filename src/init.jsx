import App from './App.jsx';
import { BrowserRouter } from 'react-router';
import { MantineProvider } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import NetworkNotifications from './components/NetworkNotifications.jsx';

const queryClient = new QueryClient();

const init = async (socket) => {
  return (
    <MantineProvider>
      <Notifications position="top-right" limit={3} />
      <NetworkNotifications />
      <BrowserRouter>
        <QueryClientProvider client={queryClient}>
          <App socket={socket} />
        </QueryClientProvider>
      </BrowserRouter>
    </MantineProvider>
  );
};

export default init;