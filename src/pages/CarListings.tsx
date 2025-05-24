import {
  Box,
  Button,
  Chip,
  CircularProgress,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography
} from '@mui/material';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../hooks/useAppDispatch';
import { useAppSelector } from '../hooks/useAppSelector';
import type { RootState } from '../store';
import { fetchCarListings } from '../store/slices/carListingsSlice';
import type { CarListing } from '../types';

const statusColors = {
  pending: '#FFA726',
  approved: '#66BB6A',
  rejected: '#EF5350',
  inactive: '#9E9E9E'
};

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(price);
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

interface CarListingsState {
  list: CarListing[];
  isLoading: boolean;
  error: string | null;
}

export default function CarListings() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const { list: cars, isLoading } = useAppSelector((state: RootState) => state.carListings) as CarListingsState;

  useEffect(() => {
    dispatch(fetchCarListings());
  }, [dispatch]);

  const filteredCars = cars.filter((car: CarListing) => {
    const matchesSearch = (
      car.make.toLowerCase().includes(searchTerm.toLowerCase()) ||
      car.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
      car.location.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
      car.location.country.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const matchesStatus = statusFilter === 'all' || car.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ mb: 4, fontWeight: 700 }}>
        Car Listings
      </Typography>

      <Stack direction="row" spacing={2} sx={{ mb: 4 }}>
        <TextField
          label="Search"
          variant="outlined"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search by make, model, or location"
          sx={{ width: 300 }}
        />
        <FormControl sx={{ width: 200 }}>
          <InputLabel>Status</InputLabel>
          <Select
            value={statusFilter}
            label="Status"
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <MenuItem value="all">All</MenuItem>
            <MenuItem value="pending">Pending</MenuItem>
            <MenuItem value="approved">Approved</MenuItem>
            <MenuItem value="rejected">Rejected</MenuItem>
            <MenuItem value="inactive">Inactive</MenuItem>
          </Select>
        </FormControl>
      </Stack>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Car</TableCell>
              <TableCell>Location</TableCell>
              <TableCell>Price/Day</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Listed</TableCell>
              <TableCell>Rating</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredCars.map((car: CarListing) => (
              <TableRow
                key={car.id}
                hover
                sx={{ cursor: 'pointer' }}
                onClick={() => navigate(`/car-listings/${car.id}`)}
              >
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Box
                      component="img"
                      src={car.photos[0]}
                      alt={`${car.make} ${car.model}`}
                      sx={{
                        width: 60,
                        height: 40,
                        objectFit: 'cover',
                        borderRadius: 1,
                      }}
                    />
                    <Box>
                      <Typography variant="body1">
                        {car.make} {car.model}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {car.year}
                      </Typography>
                    </Box>
                  </Box>
                </TableCell>
                <TableCell>
                  <Typography variant="body2">
                    {car.location.city}, {car.location.country}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2" color="primary.main" sx={{ fontWeight: 600 }}>
                    {formatPrice(car.price)}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Chip
                    label={car.status.charAt(0).toUpperCase() + car.status.slice(1)}
                    sx={{
                      bgcolor: `${statusColors[car.status as keyof typeof statusColors]}20`,
                      color: statusColors[car.status as keyof typeof statusColors],
                      fontWeight: 600,
                    }}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <Typography variant="body2">
                    {formatDate(car.createdAt.__time__)}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2">
                    {car.rating.toFixed(1)} ({car.totalRatings})
                  </Typography>
                </TableCell>
                <TableCell align="right">
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/car-listings/${car.id}`);
                    }}
                  >
                    View Details
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}