import { Box, Card, CardContent, Grid, Typography } from '@mui/material';
import { useEffect } from 'react';
import { useAppDispatch } from '../hooks/useAppDispatch';
import { useAppSelector } from '../hooks/useAppSelector';
import { fetchDashboardStats } from '../store/slices/dashboardSlice';

export default function Analytics() {
  const dispatch = useAppDispatch();
  const stats = useAppSelector((state) => state.dashboard);

  useEffect(() => {
    dispatch(fetchDashboardStats());
  }, [dispatch]);

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Analytics
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Monthly Revenue
              </Typography>
              <Typography variant="h4">
                ${stats.monthlyRevenue.toLocaleString()}
              </Typography>
              {/* Add revenue chart here */}
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Monthly Trips
              </Typography>
              <Typography variant="h4">{stats.monthlyTrips}</Typography>
              {/* Add trips chart here */}
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                User Growth
              </Typography>
              {/* Add user growth chart here */}
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Popular Car Types
              </Typography>
              {/* Add car types chart here */}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}