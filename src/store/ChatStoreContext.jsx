import { createContext, useContext } from 'react';
import { useStore } from 'zustand';

export const ChatStoreContext = createContext(null);

export const useChatStore = (selector) => {
  const store = useContext(ChatStoreContext);

  if (!store) {
    throw new Error('ChatStoreContext.Provider is missing');
  }

  return useStore(store, selector);
};

export const useChatStoreApi = () => {
  const store = useContext(ChatStoreContext);

  if (!store) {
    throw new Error('ChatStoreContext.Provider is missing');
  }

  return store;
};