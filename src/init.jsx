import App from './App.jsx';
import { BrowserRouter } from 'react-router';
import { MantineProvider } from '@mantine/core';
import '@mantine/core/styles.css';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

const init = async (socket) => {
  return (
    <MantineProvider>
      <BrowserRouter>
        <QueryClientProvider client={queryClient}>
          <App socket={socket} />
        </QueryClientProvider>
      </BrowserRouter>
    </MantineProvider>
  );
};

export default init;