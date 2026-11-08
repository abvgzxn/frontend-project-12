import { createStore } from 'zustand/vanilla';

export const createChatStore = () => createStore((set) => ({
  activeChannelId: null,

  setActiveChannelId: (id) => {
    set({ activeChannelId: id });
  },
}));