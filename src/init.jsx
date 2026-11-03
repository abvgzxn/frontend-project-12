import App from './App.jsx';
import { BrowserRouter } from 'react-router';
import { MantineProvider } from '@mantine/core';
import '@mantine/core/styles.css';


const init = async (socket) => {
return <MantineProvider>
  <BrowserRouter>
    <App socket={socket} />
  </BrowserRouter>
</MantineProvider>
}

export default init;