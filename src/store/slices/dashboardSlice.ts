import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../config/firebase';
import type { DashboardStats } from '../../types';

const initialState: DashboardStats = {
  monthlyRevenue: 0,
  monthlyTrips: 0,
  totalUsers: 0,
  totalCars: 0,
  userGrowth: [],
  popularCarTypes: [],
};

export const fetchDashboardStats = createAsyncThunk(
  'dashboard/fetchStats',
  async () => {
    // Fetch users count
    const usersSnapshot = await getDocs(collection(db, 'users'));
    const totalUsers = usersSnapshot.size;

    // Fetch cars count
    const carsSnapshot = await getDocs(collection(db, 'carListings'));
    const totalCars = carsSnapshot.size;

    // Calculate monthly revenue and trips
    const tripsSnapshot = await getDocs(collection(db, 'trips'));
    const trips = tripsSnapshot.docs.map((doc) => doc.data());
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();

    const monthlyTrips = trips.filter((trip) => {
      const tripDate = new Date(trip.startDate);
      return tripDate.getMonth() === currentMonth && tripDate.getFullYear() === currentYear;
    }).length;

    const monthlyRevenue = trips
      .filter((trip) => {
        const tripDate = new Date(trip.startDate);
        return tripDate.getMonth() === currentMonth && tripDate.getFullYear() === currentYear;
      })
      .reduce((total, trip) => total + trip.totalAmount, 0);

    // Calculate user growth
    const userGrowth = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateString = date.toISOString().split('T')[0];
      const count = Math.floor(Math.random() * 10) + 1; // Replace with actual data
      return { date: dateString, count };
    }).reverse();

    // Calculate popular car types
    const popularCarTypes = [
      { type: 'SUV', count: Math.floor(Math.random() * 50) + 20 },
      { type: 'Sedan', count: Math.floor(Math.random() * 50) + 20 },
      { type: 'Hatchback', count: Math.floor(Math.random() * 30) + 10 },
      { type: 'Luxury', count: Math.floor(Math.random() * 20) + 5 },
    ];

    return {
      monthlyRevenue,
      monthlyTrips,
      totalUsers,
      totalCars,
      userGrowth,
      popularCarTypes,
    };
  }
);

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchDashboardStats.fulfilled, (state, action) => {
      return action.payload;
    });
  },
});

export default dashboardSlice.reducer;