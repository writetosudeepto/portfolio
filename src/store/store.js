import {create} from 'zustand';

const useStore = create((set, get) => ({
  count: 0,
  increment: async () => set({ count: get().count + 1 }),
  decrement: async () => set({ count: get().count - 1 }),
}));

export default useStore;
