import { createContext, useContext } from 'react';
import { useStore } from 'zustand';

export const AuthStoreContext = createContext(null);

export const useAuthStore = (selector) => {
  const store = useContext(AuthStoreContext);

  if (!store) {
    throw new Error('AuthStoreContext.Provider is missing');
  }

  return useStore(store, selector);
};

export const useAuthStoreApi = () => {
  const store = useContext(AuthStoreContext);

  if (!store) {
    throw new Error('AuthStoreContext.Provider is missing');
  }

  return store;
};