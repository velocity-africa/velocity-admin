export type Admin = {
  id: string;
  email: string;
  role: 'admin';
};

export type CarListing = {
  id: string;
  make: string;
  model: string;
  year: number;
  photos: string[];
  description: string;
  features: string[];
  transmission: string;
  fuelType: string;
  seats: number;
  price: number;
  location: {
    city: string;
    country: string;
  };
  status: 'pending' | 'approved' | 'rejected' | 'inactive';
  isActive: boolean;
  rating: number;
  totalRatings: number;
  totalRentals: number;
  userId: string;
  carInsurance: string;
  driverLicense: string;
  controlTechnique: string;
  availability: {
    advanceNotice: string;
    availableDates: string[];
    formattedPickupTime: string;
    formattedReturnTime: string;
    maxTripDuration: string;
    minTripDuration: string;
    pickupTime: number;
    returnTime: number;
  };
  createdAt: {
    __time__: string;
  };
  updatedAt: {
    __time__: string;
  };
};

export type User = {
  id: string;
  fullName: string;
  email: string;
  mobile: string;
  dob: string;
  profileImageUrl?: string;
  tripCount: number;
  createdAt: string | { __time__: string };
  status: 'active' | 'suspended' | 'banned';
};

export type DashboardStats = {
  monthlyRevenue: number;
  monthlyTrips: number;
  totalUsers: number;
  totalCars: number;
  userGrowth: {
    date: string;
    count: number;
  }[];
  popularCarTypes: {
    type: string;
    count: number;
  }[];
};