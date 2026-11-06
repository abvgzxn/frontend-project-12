import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useAuthStore = create(
  persist(
    (set) => ({
      token: null,
      username: null,

      setToken: (token) => {
        set ({ token })
      },

      setUsername: (username) => {
        set ({ username })
      },

      logout: () => {
        set ({ token: null,
               username: null,
         })
      },
    }),
    {
      name: 'auth-storage',
    },
  ),
);