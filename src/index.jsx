import { createRoot } from 'react-dom/client'
import './index.css'
import init from './init.jsx'
import { io } from 'socket.io-client'
import './i18n.js';
import './monitoring.js';

const app = async () => {
const container = document.getElementById('root')
const root = createRoot(container)
const socket = io();
const vdom = await init(socket);
root.render(vdom)
}

app()