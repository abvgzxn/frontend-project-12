import { createStore } from 'zustand/vanilla';

export const createAuthStore = () => createStore((set) => ({
  token: null,
  username: null,

  setToken: (token) => {
    set({ token });
  },

  setUsername: (username) => {
    set({ username });
  },

  logout: () => {
    set({
      token: null,
      username: null,
    });
  },
}));