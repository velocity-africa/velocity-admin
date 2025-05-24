import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import {
    onAuthStateChanged,
    signInWithEmailAndPassword,
    signOut,
    type UserCredential,
} from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../../config/firebase';
import type { Admin } from '../../types';

interface AuthState {
  admin: Admin | null;
  isLoading: boolean;
  error: string | null;
  isInitialized: boolean;
}

const initialState: AuthState = {
  admin: null,
  isLoading: false,
  error: null,
  isInitialized: false,
};

// Check if admin data exists in localStorage
const storedAdmin = localStorage.getItem('admin');
if (storedAdmin) {
  initialState.admin = JSON.parse(storedAdmin);
}

export const initializeAuth = createAsyncThunk(
  'auth/initialize',
  async () => {
    return new Promise<Admin | null>((resolve) => {
      const unsubscribe = onAuthStateChanged(auth, async (user) => {
        if (user) {
          const adminDoc = await getDoc(doc(db, 'admins', user.uid));
          if (adminDoc.exists()) {
            const adminData = adminDoc.data() as Admin;
            const admin = {
              id: user.uid,
              email: user.email!,
              ...adminData,
            };
            localStorage.setItem('admin', JSON.stringify(admin));
            resolve(admin);
          } else {
            localStorage.removeItem('admin');
            resolve(null);
          }
        } else {
          localStorage.removeItem('admin');
          resolve(null);
        }
        unsubscribe();
      });
    });
  }
);

export const loginAdmin = createAsyncThunk(
  'auth/loginAdmin',
  async ({ email, password }: { email: string; password: string }) => {
    const userCredential: UserCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );

    const adminDoc = await getDoc(doc(db, 'admins', userCredential.user.uid));
    if (!adminDoc.exists()) {
      throw new Error('Not authorized as admin');
    }

    const adminData = adminDoc.data() as Admin;
    const admin = {
      id: userCredential.user.uid,
      email: userCredential.user.email!,
      ...adminData,
    };

    // Store admin data in localStorage
    localStorage.setItem('admin', JSON.stringify(admin));
    return admin;
  }
);

export const logoutAdmin = createAsyncThunk('auth/logoutAdmin', async () => {
  await signOut(auth);
  localStorage.removeItem('admin');
});

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(initializeAuth.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(initializeAuth.fulfilled, (state, action) => {
        state.isLoading = false;
        state.admin = action.payload;
        state.isInitialized = true;
      })
      .addCase(loginAdmin.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginAdmin.fulfilled, (state, action) => {
        state.isLoading = false;
        state.admin = action.payload;
      })
      .addCase(loginAdmin.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to login';
      })
      .addCase(logoutAdmin.fulfilled, (state) => {
        state.admin = null;
      });
  },
});

export const { clearError } = authSlice.actions;
export default authSlice.reducer;