import { configureStore } from '@reduxjs/toolkit';
import authReducer from './features/auth/authSlice';
import groupsReducer from './features/groups/groupsSlice';

export default configureStore({
  reducer: {
    auth: authReducer,
    groups: groupsReducer
  },
});