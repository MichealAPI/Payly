import { configureStore } from '@reduxjs/toolkit';
import authReducer from './features/auth/authSlice';
import groupsReducer from './features/groups/groupsSlice';
import themeReducer from './features/ui/themeSlice';

export default configureStore({
  reducer: {
    auth: authReducer,
  groups: groupsReducer,
  theme: themeReducer,
  },
});