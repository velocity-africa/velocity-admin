import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { collection, doc, getDocs, updateDoc } from "firebase/firestore";
import { db } from "../../config/firebase";
import type { CarListing } from "../../types";

interface CarListingsState {
  list: CarListing[];
  isLoading: boolean;
  error: string | null;
}

const initialState: CarListingsState = {
  list: [],
  isLoading: false,
  error: null,
};

export const fetchCarListings = createAsyncThunk(
  "carListings/fetchCarListings",
  async () => {
    const querySnapshot = await getDocs(collection(db, "car_listings"));
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as CarListing[];
  }
);

export const approveCarListing = createAsyncThunk(
  "carListings/approveCarListing",
  async (carId: string) => {
    const carRef = doc(db, "car_listings", carId);
    await updateDoc(carRef, {
      status: "approved",
      updatedAt: new Date(),
    });
    return carId;
  }
);

export const rejectCarListing = createAsyncThunk(
  "carListings/rejectCarListing",
  async (carId: string) => {
    const carRef = doc(db, "car_listings", carId);
    await updateDoc(carRef, {
      status: "rejected",
      updatedAt: new Date(),
    });
    return carId;
  }
);

const carListingsSlice = createSlice({
  name: "carListings",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCarListings.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchCarListings.fulfilled, (state, action) => {
        state.isLoading = false;
        state.list = action.payload;
      })
      .addCase(fetchCarListings.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || "Failed to fetch car listings";
      })
      .addCase(approveCarListing.fulfilled, (state, action) => {
        const car = state.list.find((car) => car.id === action.payload);
        if (car) {
          car.status = "approved";
        }
      })
      .addCase(rejectCarListing.fulfilled, (state, action) => {
        const car = state.list.find((car) => car.id === action.payload);
        if (car) {
          car.status = "rejected";
        }
      });
  },
});

export default carListingsSlice.reducer;
