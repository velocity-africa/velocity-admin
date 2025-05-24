import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { collection, doc, getDocs, updateDoc } from 'firebase/firestore';
import { db } from '../../config/firebase';
import type { User } from '../../types';

interface UsersState {
  list: User[];
  isLoading: boolean;
  error: string | null;
}

const initialState: UsersState = {
  list: [],
  isLoading: false,
  error: null,
};

export const fetchUsers = createAsyncThunk(
  'users/fetchUsers',
  async () => {
    const querySnapshot = await getDocs(collection(db, 'users'));
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as User[];
  }
);

export const updateUserStatus = createAsyncThunk(
  'users/updateStatus',
  async ({ id, status }: { id: string; status: 'active' | 'suspended' | 'banned' }) => {
    const userRef = doc(db, 'users', id);
    await updateDoc(userRef, { status });
    return { id, status };
  }
);

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.isLoading = false;
        state.list = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to fetch users';
      })
      .addCase(updateUserStatus.fulfilled, (state, action) => {
        const { id, status } = action.payload;
        const user = state.list.find((user) => user.id === id);
        if (user) {
          user.status = status;
        }
      });
  },
});

export default usersSlice.reducer;