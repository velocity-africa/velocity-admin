import {
  CheckCircle as ApproveIcon,
  ArrowBack as BackIcon,
  CalendarMonth as CalendarIcon,
  DirectionsCar as CarIcon,
  Email as EmailIcon,
  LocalGasStation as FuelIcon,
  Info as InfoIcon,
  LocationOn as LocationIcon,
  Person as PersonIcon,
  Phone as PhoneIcon,
  Block as RejectIcon,
  EventSeat as SeatsIcon,
  Speed as SpeedIcon,
  Star as StarIcon,
  AccessTime as TimeIcon,
  Visibility as ViewIcon
} from "@mui/icons-material";
import {
  Box,
  Button,
  Card,
  Chip,
  CircularProgress,
  Divider,
  Grid,
  IconButton,
  Paper,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import DocumentViewerDialog from "../components/DocumentViewerDialog";
import { useAppDispatch } from "../hooks/useAppDispatch";
import { useAppSelector } from "../hooks/useAppSelector";
import type { RootState } from "../store";
import {
  approveCarListing,
  fetchCarListings,
  rejectCarListing,
} from "../store/slices/carListingsSlice";
import { fetchUsers } from "../store/slices/usersSlice";
import type { CarListing, User } from "../types";

const statusColors = {
  pending: "#FFA726",
  approved: "#66BB6A",
  rejected: "#EF5350",
  inactive: "#9E9E9E",
};

const formatPrice = (price: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(price);
};

const formatDate = (date: string | { __time__: string }) => {
  const dateString = typeof date === "string" ? date : date.__time__;
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

interface CarListingsState {
  list: CarListing[];
  isLoading: boolean;
  error: string | null;
}

interface UsersState {
  list: User[];
  isLoading: boolean;
  error: string | null;
}

export default function CarListingDetails() {
  const theme = useTheme();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [selectedDocument, setSelectedDocument] = useState<{
    url: string;
    title: string;
  } | null>(null);

  const { list: cars, isLoading } = useAppSelector(
    (state: RootState) => state.carListings
  ) as CarListingsState;
  const car = cars.find((c: CarListing) => c.id === id);

  const { list: users, isLoading: isLoadingUsers } = useAppSelector(
    (state: RootState) => state.users
  ) as UsersState;
  const owner = car ? users.find((user) => user.id === car.userId) : undefined;

  useEffect(() => {
    if (cars.length === 0) {
      dispatch(fetchCarListings());
    }
    dispatch(fetchUsers());
  }, [dispatch, cars.length]);

  const handleApprove = () => {
    if (id) {
      dispatch(approveCarListing(id));
    }
  };

  const handleReject = () => {
    if (id) {
      dispatch(rejectCarListing(id));
    }
  };

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

  if (!car) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography>Car listing not found</Typography>
        <Button
          startIcon={<BackIcon />}
          onClick={() => navigate("/car-listings")}
        >
          Back to Listings
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ mb: 4 }}>
        <Button
          startIcon={<BackIcon />}
          onClick={() => navigate("/car-listings")}
          sx={{ mb: 2 }}
        >
          Back to Listings
        </Button>

        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 3,
          }}
        >
          <Typography variant="h4" sx={{ fontWeight: 700 }}>
            Car Details
          </Typography>
          {car.status === "pending" && (
            <Box sx={{ display: "flex", gap: 2 }}>
              <Button
                startIcon={<ApproveIcon />}
                variant="contained"
                color="success"
                onClick={handleApprove}
              >
                Approve
              </Button>
              <Button
                startIcon={<RejectIcon />}
                variant="contained"
                color="error"
                onClick={handleReject}
              >
                Reject
              </Button>
            </Box>
          )}
        </Box>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Card sx={{ mb: 3 }}>
            <Box
              sx={{
                position: "relative",
                width: "100%",
                height: 400,
                overflow: "hidden",
              }}
            >
              <img
                src={car.photos[currentPhotoIndex]}
                alt={`${car.make} ${car.model}`}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
              />
              {car.photos.length > 1 && (
                <>
                  <IconButton
                    size="large"
                    onClick={() =>
                      setCurrentPhotoIndex(
                        (prev) =>
                          (prev - 1 + car.photos.length) % car.photos.length
                      )
                    }
                    sx={{
                      position: "absolute",
                      left: 16,
                      top: "50%",
                      transform: "translateY(-50%)",
                      bgcolor: "rgba(255, 255, 255, 0.8)",
                      "&:hover": { bgcolor: "rgba(255, 255, 255, 0.9)" },
                    }}
                  >
                    {"<"}
                  </IconButton>
                  <IconButton
                    size="large"
                    onClick={() =>
                      setCurrentPhotoIndex(
                        (prev) => (prev + 1) % car.photos.length
                      )
                    }
                    sx={{
                      position: "absolute",
                      right: 16,
                      top: "50%",
                      transform: "translateY(-50%)",
                      bgcolor: "rgba(255, 255, 255, 0.8)",
                      "&:hover": { bgcolor: "rgba(255, 255, 255, 0.9)" },
                    }}
                  >
                    {">"}
                  </IconButton>
                </>
              )}
            </Box>
            <Box sx={{ p: 3 }}>
              <Grid container spacing={2}>
                {car.photos.map((photo: string, index: number) => (
                  <Grid item xs={3} key={index}>
                    <Box
                      component="img"
                      src={photo}
                      alt={`${car.make} ${car.model} - Photo ${index + 1}`}
                      sx={{
                        width: "100%",
                        height: 80,
                        objectFit: "cover",
                        borderRadius: 1,
                        cursor: "pointer",
                        border:
                          index === currentPhotoIndex
                            ? `2px solid ${theme.palette.primary.main}`
                            : "none",
                      }}
                      onClick={() => setCurrentPhotoIndex(index)}
                    />
                  </Grid>
                ))}
              </Grid>
            </Box>
          </Card>

          <Paper sx={{ p: 3, mb: 3 }}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 2,
              }}
            >
              <Box>
                <Typography variant="h5" gutterBottom>
                  {car.make} {car.model} {car.year}
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  ID: {car.id}
                </Typography>
              </Box>
              <Chip
                label={car.status.charAt(0).toUpperCase() + car.status.slice(1)}
                sx={{
                  bgcolor: `${
                    statusColors[car.status as keyof typeof statusColors]
                  }20`,
                  color: statusColors[car.status as keyof typeof statusColors],
                  fontWeight: 600,
                }}
              />
            </Box>

            <Divider sx={{ my: 3 }} />

            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <Typography
                  variant="subtitle1"
                  color="text.secondary"
                  gutterBottom
                >
                  Basic Information
                </Typography>
                <Stack spacing={2}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <LocationIcon fontSize="small" color="action" />
                    <Typography>
                      {car.location.city}, {car.location.country}
                    </Typography>
                  </Box>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <StarIcon fontSize="small" color="action" />
                    <Typography>
                      {car.rating.toFixed(1)} ({car.totalRatings} ratings)
                    </Typography>
                  </Box>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <SpeedIcon fontSize="small" color="action" />
                    <Typography>Transmission: {car.transmission}</Typography>
                  </Box>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <FuelIcon fontSize="small" color="action" />
                    <Typography>Fuel Type: {car.fuelType}</Typography>
                  </Box>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <SeatsIcon fontSize="small" color="action" />
                    <Typography>Seats: {car.seats}</Typography>
                  </Box>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <InfoIcon fontSize="small" color="action" />
                    <Typography>Total Rentals: {car.totalRentals}</Typography>
                  </Box>
                </Stack>
              </Grid>

              <Grid item xs={12} sm={6}>
                <Typography
                  variant="subtitle1"
                  color="text.secondary"
                  gutterBottom
                >
                  Availability
                </Typography>
                <Stack spacing={2}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <TimeIcon fontSize="small" color="action" />
                    <Typography>
                      Pickup: {car.availability.formattedPickupTime}
                      <br />
                      Return: {car.availability.formattedReturnTime}
                    </Typography>
                  </Box>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <CalendarIcon fontSize="small" color="action" />
                    <Typography>
                      Min Duration: {car.availability.minTripDuration}
                      <br />
                      Max Duration: {car.availability.maxTripDuration}
                    </Typography>
                  </Box>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <InfoIcon fontSize="small" color="action" />
                    <Typography>
                      Advance Notice: {car.availability.advanceNotice}
                    </Typography>
                  </Box>
                </Stack>
              </Grid>
            </Grid>

            <Divider sx={{ my: 3 }} />

            <Box>
              <Typography
                variant="subtitle1"
                color="text.secondary"
                gutterBottom
              >
                Description
              </Typography>
              <Typography>
                {car.description || "No description provided."}
              </Typography>
            </Box>

            <Divider sx={{ my: 3 }} />

            <Box>
              <Typography
                variant="subtitle1"
                color="text.secondary"
                gutterBottom
              >
                Features
              </Typography>
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                {car.features.length > 0 ? (
                  car.features.map((feature: string, index: number) => (
                    <Chip
                      key={index}
                      label={feature}
                      variant="outlined"
                      size="small"
                    />
                  ))
                ) : (
                  <Typography color="text.secondary">
                    No features specified.
                  </Typography>
                )}
              </Box>
            </Box>
          </Paper>

          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Required Documents
            </Typography>
            <Stack spacing={3}>
              <Box>
                <Typography
                  variant="subtitle1"
                  color="text.secondary"
                  gutterBottom
                >
                  Car Insurance
                </Typography>
                <Button
                  variant="outlined"
                  startIcon={<ViewIcon />}
                  onClick={() => setSelectedDocument({
                    url: car.carInsurance,
                    title: "Car Insurance"
                  })}
                >
                  View Document
                </Button>
              </Box>

              <Box>
                <Typography
                  variant="subtitle1"
                  color="text.secondary"
                  gutterBottom
                >
                  Driver License
                </Typography>
                <Button
                  variant="outlined"
                  startIcon={<ViewIcon />}
                  onClick={() => setSelectedDocument({
                    url: (car as any).driverslicense || car.driverLicense,
                    title: "Driver License"
                  })}
                  disabled={!(car as any).driverslicense && !car.driverLicense}
                >
                  View Document
                </Button>
              </Box>

              <Box>
                <Typography
                  variant="subtitle1"
                  color="text.secondary"
                  gutterBottom
                >
                  Control Technique
                </Typography>
                <Button
                  variant="outlined"
                  startIcon={<ViewIcon />}
                  onClick={() => setSelectedDocument({
                    url: car.controlTechnique,
                    title: "Control Technique"
                  })}
                >
                  View Document
                </Button>
              </Box>
            </Stack>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" color="primary" gutterBottom>
              {formatPrice(car.price)} / day
            </Typography>
            <Divider sx={{ my: 2 }} />
            <Stack spacing={2}>
              <Box>
                <Typography variant="subtitle2" color="text.secondary">
                  Listed
                </Typography>
                <Typography>{formatDate(car.createdAt)}</Typography>
              </Box>
              <Box>
                <Typography variant="subtitle2" color="text.secondary">
                  Last Updated
                </Typography>
                <Typography>{formatDate(car.updatedAt)}</Typography>
              </Box>
              <Box>
                <Typography variant="subtitle2" color="text.secondary">
                  Status
                </Typography>
                <Chip
                  label={
                    car.status.charAt(0).toUpperCase() + car.status.slice(1)
                  }
                  sx={{
                    bgcolor: `${
                      statusColors[car.status as keyof typeof statusColors]
                    }20`,
                    color:
                      statusColors[car.status as keyof typeof statusColors],
                    fontWeight: 600,
                  }}
                  size="small"
                />
              </Box>
              <Box>
                <Typography variant="subtitle2" color="text.secondary">
                  Active
                </Typography>
                <Typography>{car.isActive ? "Yes" : "No"}</Typography>
              </Box>
            </Stack>
          </Paper>

          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Owner Information
            </Typography>
            <Stack spacing={2}>
              {owner ? (
                <>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <PersonIcon fontSize="small" color="action" />
                    <Box>
                      <Typography variant="subtitle2" color="text.secondary">
                        Full Name
                      </Typography>
                      <Typography>{owner.fullName}</Typography>
                    </Box>
                  </Box>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <EmailIcon fontSize="small" color="action" />
                    <Box>
                      <Typography variant="subtitle2" color="text.secondary">
                        Email
                      </Typography>
                      <Typography>{owner.email}</Typography>
                    </Box>
                  </Box>
                  {owner.mobile && (
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <PhoneIcon fontSize="small" color="action" />
                      <Box>
                        <Typography variant="subtitle2" color="text.secondary">
                          Mobile
                        </Typography>
                        <Typography>{owner.mobile}</Typography>
                      </Box>
                    </Box>
                  )}
                  {owner.dob && (
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <CalendarIcon fontSize="small" color="action" />
                      <Box>
                        <Typography variant="subtitle2" color="text.secondary">
                          Date of Birth
                        </Typography>
                        <Typography>{owner.dob}</Typography>
                      </Box>
                    </Box>
                  )}
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <CarIcon fontSize="small" color="action" />
                    <Box>
                      <Typography variant="subtitle2" color="text.secondary">
                        Total Trips
                      </Typography>
                      <Typography>{owner.tripCount}</Typography>
                    </Box>
                  </Box>
                  {owner.profileImageUrl && (
                    <Box sx={{ mt: 2 }}>
                      <Box
                        component="img"
                        src={owner.profileImageUrl}
                        alt={owner.fullName}
                        sx={{
                          width: 100,
                          height: 100,
                          borderRadius: "50%",
                          objectFit: "cover",
                        }}
                      />
                    </Box>
                  )}
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <TimeIcon fontSize="small" color="action" />
                    <Box>
                      <Typography variant="subtitle2" color="text.secondary">
                        Member Since
                      </Typography>
                      <Typography>{formatDate(owner.createdAt)}</Typography>
                    </Box>
                  </Box>
                </>
              ) : (
                <Typography color="text.secondary">
                  {isLoadingUsers
                    ? "Loading owner information..."
                    : "Owner information not found"}
                </Typography>
              )}
            </Stack>
          </Paper>
        </Grid>
      </Grid>

      <DocumentViewerDialog
        open={selectedDocument !== null}
        onClose={() => setSelectedDocument(null)}
        documentUrl={selectedDocument?.url || ''}
        title={selectedDocument?.title || ''}
      />
    </Box>
  );
}
