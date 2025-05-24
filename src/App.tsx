import { ThemeProvider } from "@mui/material";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import DashboardLayout from "./components/layout/DashboardLayout";
import LoadingScreen from "./components/LoadingScreen";
import { useAppDispatch } from "./hooks/useAppDispatch";
import Analytics from "./pages/Analytics";
import CarListingDetails from "./pages/CarListingDetails";
import CarListings from "./pages/CarListings";
import CreateAdmin from "./pages/CreateAdmin";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Settings from "./pages/Settings";
import Users from "./pages/Users";
import type { RootState } from "./store";
import { initializeAuth } from "./store/slices/authSlice";
import { theme } from "./theme";

function App() {
  const dispatch = useAppDispatch();
  const { admin, isInitialized } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    dispatch(initializeAuth());
  }, [dispatch]);

  if (!isInitialized) {
    return <LoadingScreen />;
  }

  return (
    <ThemeProvider theme={theme}>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={admin ? <Navigate to="/dashboard" /> : <Login />} />
          <Route path="/create-admin" element={<CreateAdmin />} />
          <Route
            path="/"
            element={admin ? <DashboardLayout /> : <Navigate to="/login" />}
          >
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="car-listings" element={<CarListings />} />
            <Route path="car-listings/:id" element={<CarListingDetails />} />
            <Route path="users" element={<Users />} />
            <Route path="analytics" element={<Analytics />} />
            <Route path="settings" element={<Settings />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
