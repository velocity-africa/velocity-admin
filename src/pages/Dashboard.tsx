import {
  Assessment as AssessmentIcon,
  DirectionsCar as CarIcon,
  LocalOffer as OfferIcon,
  People as PeopleIcon,
  Speed,
  Star,
  TrendingUp,
} from "@mui/icons-material";
import {
  alpha,
  Box,
  Card,
  CircularProgress,
  Divider,
  Grid,
  LinearProgress,
  Typography,
  useTheme,
} from "@mui/material";
import { useEffect } from "react";
import { useAppDispatch } from "../hooks/useAppDispatch";
import { useAppSelector } from "../hooks/useAppSelector";
import type { RootState } from "../store";
import { fetchDashboardStats } from "../store/slices/dashboardSlice";
import type { DashboardStats } from "../types";

const StatCard = ({
  title,
  value,
  icon: Icon,
  color,
  trend,
}: {
  title: string;
  value: number | string;
  icon: React.ElementType;
  color: string;
  trend?: string;
}) => {
  const theme = useTheme();

  return (
    <Card
      sx={{
        p: 3,
        height: "100%",
        display: "flex",
        flexDirection: "column",
        position: "relative",
        overflow: "hidden",
        "&:before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "4px",
          backgroundColor: color,
        },
        "&:after": {
          content: '""',
          position: "absolute",
          top: 0,
          right: 0,
          width: "40%",
          height: "100%",
          background: `linear-gradient(to right, ${alpha(color, 0)}, ${alpha(
            color,
            0.1
          )})`,
          clipPath: "polygon(100% 0, 100% 100%, 0 100%, 60% 0)",
        },
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
        <Box
          sx={{
            p: 1,
            borderRadius: 2,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: alpha(color, 0.1),
            color: color,
          }}
        >
          <Icon />
        </Box>
        {trend && (
          <Box
            sx={{
              ml: "auto",
              display: "flex",
              alignItems: "center",
              color: theme.palette.success.main,
              typography: "body2",
            }}
          >
            <TrendingUp sx={{ fontSize: 16, mr: 0.5 }} />
            {trend}
          </Box>
        )}
      </Box>

      <Typography variant="h4" sx={{ mb: 0.5, fontWeight: 700 }}>
        {value}
      </Typography>

      <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
        {title}
      </Typography>
    </Card>
  );
};

const PerformanceCard = ({
  title,
  value,
  max,
  icon: Icon,
  color,
}: {
  title: string;
  value: number;
  max: number;
  icon: React.ElementType;
  color: string;
}) => {
  const theme = useTheme();
  const progress = (value / max) * 100;

  return (
    <Card sx={{ p: 2, display: "flex", alignItems: "center" }}>
      <Box
        sx={{
          p: 1.5,
          borderRadius: 2,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: alpha(color, 0.1),
          color: color,
          mr: 2,
        }}
      >
        <Icon />
      </Box>

      <Box sx={{ flexGrow: 1 }}>
        <Typography
          variant="body2"
          sx={{ color: theme.palette.text.secondary }}
        >
          {title}
        </Typography>
        <Typography variant="h6" sx={{ my: 0.5 }}>
          {value}
        </Typography>
        <LinearProgress
          variant="determinate"
          value={progress}
          sx={{
            height: 6,
            borderRadius: 3,
            backgroundColor: alpha(color, 0.1),
            "& .MuiLinearProgress-bar": {
              borderRadius: 3,
              backgroundColor: color,
            },
          }}
        />
      </Box>
    </Card>
  );
};

export default function Dashboard() {
  const theme = useTheme();
  const dispatch = useAppDispatch();
  const stats = useAppSelector(
    (state: RootState) => state.dashboard
  ) as DashboardStats;
  const isLoading = useAppSelector(
    (state: RootState) => state.dashboard.isLoading
  );

  useEffect(() => {
    dispatch(fetchDashboardStats());
  }, [dispatch]);

  if (isLoading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100%",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ mb: 1, fontWeight: 700 }}>
          Welcome back, Admin
        </Typography>
        <Typography
          variant="body1"
          sx={{ color: theme.palette.text.secondary }}
        >
          Here's what's happening with your car rental business today.
        </Typography>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Users"
            value={stats.totalUsers}
            icon={PeopleIcon}
            color={theme.palette.primary.main}
            trend="+12.5%"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Cars"
            value={stats.totalCars}
            icon={CarIcon}
            color={theme.palette.secondary.main}
            trend="+8.2%"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Monthly Trips"
            value={stats.monthlyTrips}
            icon={AssessmentIcon}
            color={theme.palette.warning.main}
            trend="+15.7%"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Monthly Revenue"
            value={`$${stats.monthlyRevenue.toLocaleString()}`}
            icon={OfferIcon}
            color={theme.palette.success.main}
            trend="+23.1%"
          />
        </Grid>

        <Grid item xs={12}>
          <Divider sx={{ my: 3 }} />
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <PerformanceCard
            title="Average Car Rating"
            value={4.8}
            max={5}
            icon={Star}
            color={theme.palette.warning.main}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <PerformanceCard
            title="Fleet Utilization"
            value={85}
            max={100}
            icon={Speed}
            color={theme.palette.success.main}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <PerformanceCard
            title="Customer Satisfaction"
            value={92}
            max={100}
            icon={TrendingUp}
            color={theme.palette.primary.main}
          />
        </Grid>
      </Grid>
    </Box>
  );
}
