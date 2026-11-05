import { create } from 'zustand';

export const useChatStore = create((set) => ({
  activeChannelId: null,

  setActiveChannelId: (id) => {
    set({ activeChannelId: id })
  },
}));