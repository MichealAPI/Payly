// features/auth/authSlice.ts
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiClient from "@/api/axiosConfig";

export interface AuthState {
  currentUser: any | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  sessionId: string | null;
  sessionExpiresAt: string | null;
  initialized: boolean; // becomes true after we have determined auth status (verified or no session)
}

const initialState: AuthState = {
  currentUser: null,
  isAuthenticated: false,
  isLoading: true,
  sessionId: null,
  sessionExpiresAt: null,
  error: null,
  initialized: false,
};

export const verifyAuthStatus = createAsyncThunk(
  "auth/verifyAuthStatus",
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.get("/auth/profile");
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Failed to check auth");
    }
  }
);

export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async (
    {
      email,
      password,
      firstName,
      lastName,
      gender,
    }: {
      email: string;
      password: string;
      firstName: string;
      lastName: string;
      gender: string;
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await apiClient.post("/auth/register", {
        email,
        password,
        firstName,
        lastName,
        gender,
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue({
        message: error.response?.data || "Registration failed",
      });
    }
  }
);

export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (
    { email, password }: { email: string; password: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await apiClient.post("/auth/login", { email, password });
      return response.data; // server returns user object directly
    } catch (error: any) {
      return rejectWithValue({
        message: error.response?.data || "Login failed",
      });
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.currentUser = null;
      state.isAuthenticated = false;
      state.sessionId = null;
      state.error = null;
    },
    setAuthInitialized: (state) => {
  state.isLoading = false;
  state.initialized = true;
    },
  },
  extraReducers: (builder) => {
    builder
      // Email/password login
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.currentUser = action.payload.user;
        state.sessionId = action.payload.sessionId; // store sessionId for persistence
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        // Normalize error into a string so UI code can safely call string methods.
        const payload = action.payload as any;
        const errMsg =
          typeof payload === "string"
            ? payload
            : (payload?.message ??
              (payload ? JSON.stringify(payload) : null) ??
              action.error?.message ??
              "Login failed");
        state.error = String(errMsg);
        state.currentUser = null;
        state.isAuthenticated = false;
      })

      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.currentUser = action.payload.user;
        state.sessionId = action.payload.sessionId; // store sessionId for persistence
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        // Normalize error into a string so UI code can safely call string methods.
        const payload = action.payload as any;
        const errMsg =
          typeof payload === "string"
            ? payload
            : (payload?.message ??
              (payload ? JSON.stringify(payload) : null) ??
              action.error?.message ??
              "Registration failed");
        state.error = String(errMsg);
        state.currentUser = null;
        state.isAuthenticated = false;
      })

      // Check auth status (profile)
      .addCase(verifyAuthStatus.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(verifyAuthStatus.fulfilled, (state, action) => {
        // server should return { user, sessionId } or similar
        if (action.payload) {
          state.isAuthenticated = true;
          state.currentUser = action.payload;
        } else {
          state.isAuthenticated = false;
          state.currentUser = null;
        }

  state.isLoading = false;
  state.initialized = true; // we've resolved auth (success or empty)
      })
      .addCase(verifyAuthStatus.rejected, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.currentUser = null;
        state.sessionId = null;
        const payload = action.payload as any;
        const errMsg =
          typeof payload === "string"
            ? payload
            : (payload?.message ??
              (payload ? JSON.stringify(payload) : null) ??
              action.error?.message ??
              "Failed to check auth");
        state.error = String(errMsg);
  state.initialized = true; // even on failure we finish initialization
      });
  },
});

export const { logout, setAuthInitialized } = authSlice.actions;
export default authSlice.reducer;
