import { createSlice, nanoid } from '@reduxjs/toolkit';

const notificationSlice = createSlice({
  name: 'notifications',
  initialState: {
    items: [],
    lastPollSince: null,
  },
  reducers: {
    addNotification(state, action) {
      const { activityId, activityType, message } = action.payload;
      state.items.unshift({
        id: nanoid(),
        activityId,
        activityType,
        message,
        type: 'recommendation',
        timestamp: Date.now(),
        read: false,
      });
    },
    markRead(state, action) {
      const n = state.items.find((x) => x.id === action.payload);
      if (n) n.read = true;
    },
    removeNotification(state, action) {
      state.items = state.items.filter((x) => x.id !== action.payload);
    },
    clearAll(state) {
      state.items = [];
    },
    setLastPollSince(state, action) {
      state.lastPollSince = action.payload;
    },
  },
});

export const { addNotification, markRead, removeNotification, clearAll, setLastPollSince } =
  notificationSlice.actions;
export default notificationSlice.reducer;
